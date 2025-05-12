from .base import OrmBase
from .posts import PostOut
from datetime import datetime
from typing import List, Optional

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

class UserDeleteRequest:
    token: str
    password: str

UserWithPosts.update_forward_refs()
