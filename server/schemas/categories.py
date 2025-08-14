from __future__ import annotations
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional
from pydantic import Field
from .base import OrmBase, Approval

if TYPE_CHECKING:
    from .posts import PostOut

class CategoryCreate(OrmBase):
    title: str
    description: str

class CategoryOut(OrmBase):
    id: int
    title: str
    description: str
    created_at: datetime

class CategoryPatch(OrmBase):
    title: Optional[str] = None
    description: Optional[str] = None
    stat: Optional[Approval] = None

class CategoryWithPosts(OrmBase):
    id: int
    title: str
    description: str
    posts: List["PostOut"] = Field(default_factory=list)

class CategoryModView(OrmBase):
    id: int
    title: str
    description: str
    stat: Approval
