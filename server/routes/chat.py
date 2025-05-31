from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.chats import ChatCreate, ChatOpen
from schemas.messages import MessageOut
from crud.chat import get_chat, get_messages_of_chats, delete_chat
from utils.user import get_current_user
from typing import List
from db import get_db

router = APIRouter(prefix="/chat", tags=["Chats"])

@router.post("/chats/create")
def create(chat: ChatCreate, db: Session = Depends(get_db)):
    return create_chat(db = db, chat_data = chat)

@router.get("/chats/{id}/messages")
def get_messages(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[MessageOut]:
    return get_messages_of_chat(db = db, chat_id = id, skip = skip, limit = count)

@router.delete("/chats/{id}", response_model=ChatOpen)
def remove_chat(id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    db_chat = get_chat(db = db, chat_id = id)

    if db_chat.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this chat")

    return delete_chat(id, current_user.id)
