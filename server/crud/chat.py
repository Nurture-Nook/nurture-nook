from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Chat, Message
from schemas.chats import ChatCreate, ChatOpen
from schemas.messages import MessageCreate, MessageOut
from typing import List
from datetime import datetime

# CREATE
def create_chat(db: Session, chat_data: ChatCreate) -> ChatOpen:
    chat = Chat()
    db.add(chat)
    db.commit()
    db.refresh(chat)

    message = Message(
        sender=chat_data.message.sender,
        content=chat_data.message.content,
        chat_id=chat.id
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return ChatOpen.from_orm(chat)

# READ
def get_chat_model(db: Session, chat_id: int) -> Chat:
    db_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not db_chat:
        raise HTTPException(status_code = 404, detail = "Chat not Found")
    return db_chat

def get_chat(db: Session, chat_id: int) -> ChatOpen:
    return ChatOpen.from_orm(get_chat_model(db, chat_id))

def get_all_chats(db: Session) -> List[ChatOpen]:
    return [ChatOpen.from_orm(chat) for chat in db.query(Chat).all()]

# UPDATE
def add_message_to_chat(db: Session, chat_id: int, message_data: MessageCreate) -> MessageOut:
    chat = get_chat_model(db, chat_id)
    if not chat:
        raise HTTPException(status_code = 404, detail = "Chat not Found")

    new_message = Message(
        sender=message_data.sender,
        content=message_data.content,
        chat_id=chat.id
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return MessageOut.from_orm(new_message)

# DELETE
def delete_chat(db: Session, chat_id: int) -> ChatOpen:
    chat = get_chat_model(db, chat_id)

    db.delete(chat)
    db.commit()
    return ChatOpen.from_orm(chat)
