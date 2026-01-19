from fastapi import APIRouter, HTTPException
from app.chatbot import ChatRequest, ChatResponse, build_messages, groq_chat_completion

router = APIRouter()

@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        messages = build_messages(req.messages, req.report_context)
        reply = await groq_chat_completion(messages)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
