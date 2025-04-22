from base import OrmBase, SenderType
from datetime import datetime

class MessageCreate(OrmBase):
    content: str

class MessageOut(OrmBase):
    id: int
    sender = SenderType
    created_at = datetime

class MessagePatch(OrmBase):
    content: str
