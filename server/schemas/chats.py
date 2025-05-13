from base import OrmBase
from .messages import MessageOut
from datetime import datetime
from typing import List

class ChatCreate(OrmBase):
    message: MessageOut

class ChatOpen(OrmBase):
    started_at: datetime

    messages: List[MessageOut]

ChatCreate.update_forward_refs()
ChatOpen.update_forward_refs()
