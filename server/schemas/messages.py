from base import OrmBase, SenderType
from datetime import datetime

class MessageCreate(OrmBase):
    sender: SenderType
    content: str
    chat_id: int
    user_id: int

class MessageOut(OrmBase):
    id: int
    sender: SenderType
    content: str
    chat_id: int
    created_at: datetime

class MessagePatch(OrmBase):
    content: str
