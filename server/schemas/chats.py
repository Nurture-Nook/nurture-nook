from .base import OrmBase
from datetime import datetime

class ChatCreate(OrmBase):
    id: int
    user_id: int

class ChatOpen(OrmBase):
    id: int
    user_id: int
    created_at: datetime
