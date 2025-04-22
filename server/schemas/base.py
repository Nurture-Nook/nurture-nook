from pydantic import BaseModel
from enum import Enum

class OrmBase(BaseModel):
    class Config:
        orm_mode: True

class Approval(Enum):
	APPROVED = 'approved'
	PENDING = 'pending'
	REJECTED = 'rejected'

class SenderType(Enum):
	USER = 'user'
	BOT = 'bot'
