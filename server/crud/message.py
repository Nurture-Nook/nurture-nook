from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Message
from schemas.messages import MessageCreate, MessageOut, MessagePatch
from typing import List
from datetime import datetime
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def send_message(db: Session, chat_id: int, message_data: MessageCreate) -> MessageOut:
    chat = get_chat_model(db, chat_id)

    new_message = Message(
        sender=message_data.sender,
        content=message_data.content,
        chat_id=chat.id
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    logger.info(f"Message {new_message.id} added to Chat {chat_id}")

    return MessageOut.from_orm(new_message)

# READ
def get_message_model(db: Session, message_id: int) -> Message:
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code = 404, detail = "Message not Found")
    return db_message

def get_message(db: Session, message_id: int) -> MessageOut:
    return MessageOut.from_orm(get_message_model(db, message_id))

# UPDATE
def edit_message(db: Session, message_id: int, message_update: MessagePatch) -> MessageOut:
    db_message = get_message_model(db, message_id)

    if not message_update.content.strip():
        raise HTTPException(status_code=400, detail="Empty Message Content")

    if db_message.content.strip() == message_update.content.strip():
        raise HTTPException(status_code=400, detail="Message Unchanged")

    db_message.content = message_update.content.strip()
    db.commit()
    db.refresh(db_message)

    logger.info(f"Message {db_message.id} edited")

    return MessageOut.from_orm(db_message)
