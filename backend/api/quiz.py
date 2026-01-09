from fastapi import APIRouter, HTTPException
import json
from core.rag import rag_manager

router = APIRouter()

@router.get("/generate")
async def generate_quiz(num_questions: int = 5):
    try:
        quiz_raw = rag_manager.generate_quiz(num_questions)
        
        if quiz_raw == "No documents uploaded yet.":
             raise HTTPException(status_code=400, detail="No documents uploaded yet. Please upload a PDF first.")

        # Parse logic if LLM returns string with markdown blocks
        if "```json" in quiz_raw:
            quiz_raw = quiz_raw.split("```json")[1].split("```")[0].strip()
        elif "```" in quiz_raw:
             quiz_raw = quiz_raw.split("```")[1].split("```")[0].strip()
        
        quiz_data = json.loads(quiz_raw)
        return quiz_data
    except Exception as e:
        print(f"CRITICAL ERROR in Quiz Generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
