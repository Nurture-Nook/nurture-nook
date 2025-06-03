from .base import OrmBase
from .posts import PostOut
from datetime import datetime
from typing import List, Optional
from pydantic import Field, validator

class UserCreate(OrmBase):
    username: str
    email: str
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
    email: str

class UserWithPosts(OrmBase):
    id: int
    role: str
    posts: List['PostOut']
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
    new_username: str | None = None
    new_email: str | None = None
    email_token: str | None = None
    current_password: str | None = None
    new_password: str | None = None

    @validator("*", pre=True)
    def at_least_one_field(cls, v, values, **kwargs):
        if not any(values.values()):
            raise ValueError("At least one field must be updated")
        return v

class UserDeleteRequest(OrmBase):
    token: str
    password: str

UserWithPosts.update_forward_refs()
