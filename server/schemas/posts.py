from __future__ import annotations
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from pydantic import Field, field_validator
from .base import OrmBase

if TYPE_CHECKING:
    from .categories import CategoryOut
    from .comments import CommentOut
    from .warnings import ContentWarningOut

class PostCreate(OrmBase):
    title: str
    description: str
    categories: List[int]
    warnings: List[int] = Field(default_factory=list)
    user_id: int

    @field_validator('categories')
    def at_least_one_category(cls, v):
        if not v:
            raise ValueError('Post Must Have At Least One Category')
        return v

class PostOut(OrmBase):
    id: int
    title: str
    warnings: List[int] = Field(default_factory=list)
    created_at: datetime

class PostPatch(OrmBase):
    title: Optional[str] = None
    description: Optional[str] = None
    categories: List[int] = Field(default_factory=list)
    warnings: List[int] = Field(default_factory=list)

class PostModPatch(OrmBase):
    categories: List[int] = Field(default_factory=list)
    warnings: List[int] = Field(default_factory=list)
    flags: List[int] = Field(default_factory=list)
    is_flagged: bool = False
    is_deleted: bool = False

class PostDetailedOut(OrmBase):
    id: int
    user_id: int
    title: str
    description: str
    temporary_username: str
    categories: List["CategoryOut"]
    warnings: List["ContentWarningOut"] = Field(default_factory=list)
    comments: List["CommentOut"] = Field(default_factory=list)
    created_at: datetime

class PostModView(OrmBase):
    id: int
    user_id: int
    flags: List[int] = Field(default_factory=list)
    is_flagged: bool
    is_deleted: bool
    created_at: datetime
