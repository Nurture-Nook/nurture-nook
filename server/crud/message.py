from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Chat, Message
from schemas.chats import ChatCreate, ChatOpen
from schemas.messages import MessageCreate, MessageOut, MessagePatch
from crud.chat import add_message_to_chat
from typing import List
from datetime import datetime

# READ
def get_message_model(db: Session, message_id: int) -> Message:
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code = 404, detail = "Message not Found")
    return db_message

def get_message(db: Session, message_id: int) -> MessageOut:
    return MessageOut.from_orm(get_message_model(db, message_id))

def get_messages_of_chat(db: Session, chat_id: int) -> List[MessageOut]:
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at).all()
    return [MessageOut.from_orm(msg) for msg in messages]

# UPDATE
def edit_message(db: Session, message_id: int, message_update: MessagePatch) -> MessageOut:
    db_message = get_message_model(db, message_id)
    db_message.content = message_update.content
    db.commit()
    db.refresh(db_message)
    return MessageOut.from_orm(db_message)
