from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.rag import rag_manager

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/")
async def chat(request: ChatRequest):
    try:
        response = rag_manager.query(request.question)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
