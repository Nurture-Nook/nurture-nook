from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.messages import MessageCreate, MessagePatch, MessageOut
from ..crud.message import send_message, edit_message
from ..crud.chat import get_messages_of_chat
from ..services.gemini import generate_reply
from ..utils.history import format_history
from pydantic import BaseModel
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix="/message", tags=["Messages"])

@router.post("/create")
def create(message: MessageCreate, chat_id: int, db: Session = Depends(get_db)):
    user_msg = send_message(db = db, chat_id = chat_id, message_data = message)

    history_models = get_messages_of_chat(db = db, chat_id = chat_id)
    formatted_history = format_history(history_models)

    ai_response = generate_reply(formatted_history + [{
        "role": "user",
        "parts": [message.content]
    }])

    ai_message = MessageCreate(sender = "ai", content = ai_response, chat_id = chat_id)
    ai_msg = send_message(db = db, chat_id = chat_id, message_data = ai_message)

    return {
        "user": MessageOut.model_validate(user_msg),
        "ai": MessageOut.model_validate(ai_msg)
    }


@router.put("/messages/{id}/edit")
def edit(id: int, update: MessagePatch, db: Session = Depends(get_db)):
    try:
        updated_user_msg = edit_message(db = db, message_id = id, message_update = update)

        chat_id = updated_user_msg.chat_id
        history_models = get_messages_of_chat(db = db, chat_id = chat_id)
        formatted_history = format_history(history_models)

        new_ai_response = generate_reply(formatted_history)

        ai_message = MessageCreate(sender = "ai", content = new_ai_response, chat_id = chat_id)
        ai_msg = send_message(db = db, chat_id = chat_id, message_data = ai_message)

        return {
            "user": MessageOut.model_validate(updated_user_msg),
            "ai": MessageOut.model_validate(ai_msg)
        }
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating message: {str(e)}")
