import os
from typing import List, Optional, Dict, Any

import httpx
from pydantic import BaseModel, Field


# --------------------------------------------------
# Groq settings (read at runtime, NOT import time)
# --------------------------------------------------
def get_groq_settings():
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    return api_key, model, base_url


# --------------------------------------------------
# Safety-focused system prompt
# --------------------------------------------------
SYSTEM_PROMPT = """You are a medical information chatbot.
Rules:
- You are NOT a doctor. Do NOT diagnose. Do NOT prescribe or give medication doses.
- Ask brief follow-up questions when useful (age range, duration, severity, pregnancy, chronic disease, meds).
- Provide general educational information and guidance only.
- If symptoms may be urgent/emergency (chest pain, trouble breathing, stroke signs, suicidal thoughts, severe bleeding),
  clearly tell the user to seek emergency care immediately.
- Be structured:
  1) What this could mean (general)
  2) What to do now
  3) Red flags
  4) What to tell a clinician
- If asked for drug dosing or diagnosis, politely refuse and suggest consulting a healthcare professional.
"""


# --------------------------------------------------
# Schemas
# --------------------------------------------------
class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    report_context: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str


# --------------------------------------------------
# Groq API call
# --------------------------------------------------
async def groq_chat_completion(messages: List[Dict[str, str]]) -> str:
    api_key, model, base_url = get_groq_settings()

    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing")

    payload: Dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 700,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"].strip()


# --------------------------------------------------
# Prompt construction
# --------------------------------------------------
def build_messages(
    user_messages: List[ChatMessage],
    report_context: Optional[str],
) -> List[Dict[str, str]]:

    messages: List[Dict[str, str]] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    if report_context:
        messages.append({
            "role": "system",
            "content": (
                "Context from the user's medical report "
                "(for explanation only, not diagnosis):\n"
                + report_context[:8000]
            ),
        })

    for msg in user_messages:
        # Prevent user from injecting system prompts
        if msg.role == "system":
            continue
        messages.append({"role": msg.role, "content": msg.content})

    return messages
