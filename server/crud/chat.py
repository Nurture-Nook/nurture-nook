from fastapi import HTTPException
from server.middleware import logger_middleware
from sqlalchemy.orm import Session
from ..models import Chat, Message
from ..schemas.chats import ChatCreate, ChatOpen
from ..schemas.messages import MessageOut
from typing import List

logger = logger_middleware.getLogger(__name__)
logger.setLevel(logger_middleware.INFO)

# CREATE
def create_chat(db: Session, chat_data: ChatCreate) -> ChatOpen:
    if not chat_data.message.content:
        raise HTTPException(status_code = 400, detail = "Chat Message Empty")

    chat = Chat()
    db.add(chat)
    db.commit()
    db.refresh(chat)

    logger.info(f"Chat {chat.id} created")

    message = Message(
        sender=chat_data.message.sender,
        content=chat_data.message.content.strip(),
        chat_id=chat.id
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    logger.info(f"Message {message.id} added to Chat {chat.id}")

    return ChatOpen.model_validate(chat)

# READ
def get_chat_model(db: Session, chat_id: int) -> Chat:
    db_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not db_chat:
        raise HTTPException(status_code = 404, detail = "Chat not Found")
    return db_chat

def get_chat(db: Session, chat_id: int) -> ChatOpen:
    return ChatOpen.model_validate(get_chat_model(db, chat_id))

def get_all_chats(db: Session, skip: int = 0, limit: int = 100) -> List[ChatOpen]:
    return [ChatOpen.model_validate(chat) for chat in db.query(Chat).offset(skip).limit(limit).all()]

def get_messages_of_chat(db: Session, chat_id: int, skip: int = 0, limit: int = 100) -> List[MessageOut]:
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    return [MessageOut.model_validate(msg) for msg in messages]

# DELETE
def delete_chat(db: Session, chat_id: int) -> ChatOpen:
    chat = get_chat_model(db, chat_id)

    chat_out = ChatOpen.model_validate(chat)

    db.delete(chat)
    db.commit()

    logger.info(f"Chat {chat_out.id} deleted")

    return chat_out
