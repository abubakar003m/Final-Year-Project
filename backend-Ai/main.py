"""
Health Navigator API
Main FastAPI application
"""

import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict, Optional

from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import get_ai_config, get_settings
from models.schemas import (
    AnalysisResult,
    QuestionRequest,
    QuestionResponse,
    UploadResponse,
)
from routes.chat import router as chat_router
from services.ai_analyzer import HealthReportAnalyzer
from services.pdf_processor import PDFProcessor
from services.vector_store import VectorStoreManager

# Load environment variables from backend/.env
load_dotenv()

# -------------------- Logging --------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("health-navigator")

# -------------------- Settings --------------------
settings = get_settings()

# -------------------- Global services --------------------
pdf_processor: Optional[PDFProcessor] = None
ai_analyzer: Optional[HealthReportAnalyzer] = None
vector_manager: Optional[VectorStoreManager] = None

# In-memory storage (replace with DB in production)
report_storage: Dict[str, Dict] = {}


# -------------------- Lifespan --------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize services on startup, cleanup on shutdown
    """
    global pdf_processor, ai_analyzer, vector_manager

    logger.info("🚀 Starting Health Navigator API...")

    try:
        # Initialize services
        pdf_processor = PDFProcessor(
            temp_dir=settings.temp_dir,
            upload_dir=settings.upload_dir,
        )

        ai_config = get_ai_config()

        ai_analyzer = HealthReportAnalyzer(
            api_key=ai_config["api_key"],
            model=ai_config["model"],
            temperature=ai_config["temperature"],
            max_tokens=ai_config["max_tokens"],
            use_groq=(ai_config.get("provider") == "groq"),
        )

        vector_manager = VectorStoreManager(
            api_key=ai_config["api_key"],
            use_groq=(ai_config.get("provider") == "groq"),
        )

        logger.info("✅ All services initialized")

        yield

    finally:
        logger.info("🛑 Shutting down...")


# -------------------- App --------------------
app = FastAPI(
    title="Health Navigator API",
    description="AI-powered health report analysis and Q&A system",
    version="1.0.0",
    lifespan=lifespan,
)

# -------------------- CORS --------------------
allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://final-year-project-22-arid.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Routers --------------------
# ✅ include router AFTER app is created
app.include_router(chat_router)


# -------------------- Routes --------------------
@app.get("/")
async def root():
    return {
        "message": "Health Navigator API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "upload": "POST /api/upload",
            "analyze": "POST /api/analyze/{report_id}",
            "ask": "POST /api/ask",
            "chat": "POST /api/chat",
            "get_report": "GET /api/report/{report_id}",
            "delete_report": "DELETE /api/report/{report_id}",
            "list_reports": "GET /api/reports",
            "health": "GET /health",
            "render_health": "GET /api/health",
        },
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "pdf_processor": pdf_processor is not None,
            "ai_analyzer": ai_analyzer is not None,
            "vector_manager": vector_manager is not None,
        },
    }


@app.post("/api/upload", response_model=UploadResponse)
async def upload_report(file: UploadFile = File(...)):
    try:
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        content = await file.read()
        file_size = len(content)

        if file_size > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {settings.max_file_size / 1024 / 1024:.2f}MB",
            )

        if pdf_processor is None:
            raise HTTPException(status_code=500, detail="PDF processor not initialized")

        report_id = str(uuid.uuid4())
        file_id, temp_path = pdf_processor.save_upload(content, file.filename)

        report_storage[report_id] = {
            "report_id": report_id,
            "file_id": file_id,
            "filename": file.filename,
            "file_size": file_size,
            "temp_path": temp_path,
            "status": "uploaded",
            "message": "File uploaded successfully",
        }

        logger.info(f"✅ Uploaded report {report_id}: {file.filename} ({file_size} bytes)")

        return UploadResponse(
            report_id=report_id,
            filename=file.filename,
            file_size=file_size,
            message="File uploaded successfully. Use /api/analyze/{report_id} to analyze.",
            status="uploaded",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("❌ Upload error")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/api/analyze/{report_id}", response_model=AnalysisResult)
async def analyze_report(report_id: str, background_tasks: BackgroundTasks):
    try:
        if report_id not in report_storage:
            raise HTTPException(status_code=404, detail="Report not found")

        report_info = report_storage[report_id]

        if report_info.get("status") == "analyzed":
            logger.info(f"Returning cached analysis for {report_id}")
            return AnalysisResult(**report_info["analysis"])

        if pdf_processor is None or ai_analyzer is None or vector_manager is None:
            raise HTTPException(status_code=500, detail="Services not initialized")

        temp_path = report_info["temp_path"]
        report_storage[report_id]["status"] = "processing"

        logger.info(f"📄 Extracting data from {report_id}...")
        extracted_data = pdf_processor.process_health_report(temp_path)

        logger.info(f"🤖 Analyzing report {report_id}...")
        analysis_result = ai_analyzer.analyze_report(extracted_data)
        analysis_result["report_id"] = report_id

        logger.info(f"🔍 Creating vector store for {report_id}...")
        vector_manager.create_report_vectorstore(
            report_id=report_id,
            report_text=extracted_data["raw_text"],
            metadata={
                "filename": report_info["filename"],
                "report_type": analysis_result.get("report_type", "Unknown"),
            },
        )

        report_storage[report_id].update(
            {
                "status": "analyzed",
                "analysis": analysis_result,
                "extracted_data": extracted_data,
            }
        )

        background_tasks.add_task(pdf_processor.cleanup, temp_path)

        logger.info(f"✅ Successfully analyzed report {report_id}")
        return AnalysisResult(**analysis_result)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("❌ Analysis error")
        if report_id in report_storage:
            report_storage[report_id]["status"] = "error"
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    try:
        if request.report_id not in report_storage:
            raise HTTPException(status_code=404, detail="Report not found")

        report_info = report_storage[request.report_id]

        if report_info.get("status") != "analyzed":
            raise HTTPException(
                status_code=400,
                detail="Report not yet analyzed. Call /api/analyze/{report_id} first.",
            )

        if ai_analyzer is None or vector_manager is None:
            raise HTTPException(status_code=500, detail="Services not initialized")

        logger.info(f"🔍 Searching for context: {request.question[:50]}...")
        similar_chunks = vector_manager.search_similar(
            report_id=request.report_id,
            query=request.question,
            k=3,
        )

        context = "\n\n".join([chunk["text"] for chunk in similar_chunks])

        logger.info("🤖 Generating answer...")
        response = ai_analyzer.answer_question(
            question=request.question,
            report_context=context,
            conversation_history=request.conversation_history,
        )

        sources = [f"Section {chunk['chunk_index'] + 1}" for chunk in similar_chunks]

        logger.info(f"✅ Question answered for report {request.report_id}")

        return QuestionResponse(
            answer=response["answer"],
            confidence=response["confidence"],
            timestamp=response["timestamp"],
            sources=sources,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("❌ Question answering error")
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")


@app.get("/api/report/{report_id}")
async def get_report(report_id: str):
    if report_id not in report_storage:
        raise HTTPException(status_code=404, detail="Report not found")

    report_info = report_storage[report_id]

    if report_info.get("status") == "analyzed":
        return {
            "report_id": report_id,
            "status": report_info["status"],
            "filename": report_info["filename"],
            "analysis": report_info["analysis"],
        }

    return {
        "report_id": report_id,
        "status": report_info.get("status"),
        "filename": report_info.get("filename"),
        "message": report_info.get("message", "Processing..."),
    }


@app.delete("/api/report/{report_id}")
async def delete_report(report_id: str):
    if report_id not in report_storage:
        raise HTTPException(status_code=404, detail="Report not found")

    try:
        if vector_manager is not None:
            vector_manager.delete_vectorstore(report_id)

        del report_storage[report_id]

        logger.info(f"🗑️ Deleted report {report_id}")
        return {"message": "Report deleted successfully", "report_id": report_id}

    except Exception as e:
        logger.exception("❌ Error deleting report")
        raise HTTPException(status_code=500, detail=f"Failed to delete report: {str(e)}")


@app.get("/api/reports")
async def list_reports():
    reports = []
    for report_id, info in report_storage.items():
        reports.append(
            {
                "report_id": report_id,
                "filename": info.get("filename"),
                "status": info.get("status"),
                "file_size": info.get("file_size"),
            }
        )
    return {"total": len(reports), "reports": reports}


@app.get("/api/health")
async def render_health():
    return {
        "status": "healthy",
        "service": "health-navigator-api",
        "timestamp": datetime.utcnow().isoformat(),
    }


# -------------------- Error handler --------------------
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"❌ Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn

    logger.info("🏥 Starting Health Navigator API...")
    logger.info(f"   Frontend: {getattr(settings, 'frontend_url', '')}")
    logger.info(f"   Debug: {getattr(settings, 'debug', False)}")

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=getattr(settings, "debug", False),
    )
