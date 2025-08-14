from __future__ import annotations
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from pydantic import Field
from .base import OrmBase

if TYPE_CHECKING:
    from .warnings import ContentWarningOut

class CommentCreate(OrmBase):
    content: str
    warnings: List[int] = Field(default_factory=list)
    parent_comment_id: Optional[int] = None
    user_id: int
    post_id: int

class CommentOut(OrmBase):
    id: int
    user_id: int
    temporary_username: str
    content: str
    warnings: List["ContentWarningOut"]
    parent_comment_id: Optional[int] = None
    created_at: datetime

class CommentPatch(OrmBase):
    content: Optional[str] = None
    warnings: List[int] = Field(default_factory=list)

class CommentModPatch(OrmBase):
    warnings: List[int] = Field(default_factory=list)
    flags: List[int] = Field(default_factory=list)
    is_flagged: bool = False
    is_deleted: bool = False

class CommentModView(OrmBase):
    id: int
    user_id: int
    flags: List[int] = Field(default_factory=list)
    is_flagged: bool
    is_deleted: bool
    created_at: datetime
