from .base import OrmBase, Approval
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional

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
    title: Optional[str]
    description: Optional[str]
    stat: Optional[Approval]

class CategoryWithPosts(OrmBase):
    id: int
    title: str
    description: str
    posts: List['PostOut']

class CategoryModView(OrmBase):
    id: int
    title: str
    description: str
    stat: Approval

CategoryWithPosts.model_rebuild()
