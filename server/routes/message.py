from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Message
from schemas.messages import MessageCreate, MessageOut, MessagePatch
from typing import List
from datetime import datetime

router = APIRouter(prefix="/message", tags=["Messages"])

@router.post("/create")
def create(message: MessageCreate, chat_id: int, db: Session = Depends(get_db)):
    return send_message(db = db, chat_id = chat_id, message_data = message)

@router.put("/messages/{id}/edit")
def edit(id: int, update: MessagePatch, db: Session = Depends(get_db))
    try:
        edit_message(db = db, message_id = id, message_update = update)

        return MessageResponse(message="Message updated successfully")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating message: {str(e)}")
