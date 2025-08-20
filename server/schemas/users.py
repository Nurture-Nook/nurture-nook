from .base import OrmBase
from .posts import PostOut
from .comments import CommentOut
from datetime import datetime
from pydantic import field_validator
from typing import List, Optional

class UserCreate(OrmBase):
    username: str
    email: Optional[str] = None
    password: str

class UserLogin(OrmBase):
    username: str
    password: str

class UserOut(OrmBase):
    id: int
    role: str
    created_at: datetime

class UserPrivateOut(OrmBase):
    id: int
    username: str
    email: Optional[str] = None
    created_at: datetime

class UserWithContent(OrmBase):
    id: int
    role: str
    posts: List['PostOut']
    comments: List['CommentOut']
    created_at: datetime

class EmailVerificationRequest(OrmBase):
    new_email: str
    token: str

class UsernameUpdateRequest(OrmBase):
    new_username: str

class PasswordUpdateRequest(OrmBase):
    current_password: str
    new_password: str

class ProfileUpdateRequest(OrmBase):
    new_username: Optional[str] = None
    new_email: Optional[str] = None
    email_token: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

    @field_validator("*")
    def at_least_one_field(cls, v, values):
        if not any(values.values()):
            raise ValueError("At least one field must be updated")
        return v

class UserDeleteRequest(OrmBase):
    password: str
    password: str
