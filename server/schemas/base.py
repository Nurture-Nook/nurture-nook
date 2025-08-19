from pydantic import BaseModel, ConfigDict
from enum import Enum

class OrmBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class Approval(str, Enum):
    APPROVED = 'approved'
    PENDING = 'pending'
    REJECTED = 'rejected'

class SenderType(str, Enum):
    USER = 'user'
    BOT = 'bot'
    