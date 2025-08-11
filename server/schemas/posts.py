from .base import OrmBase
from .comments import CommentOut
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .categories import CategoryOut
    from .warnings import ContentWarningOut

class PostCreate(OrmBase):
    title: str
    description: str
    categories: List[int]
    warnings: List[int]
    user_id: int

class PostOut(OrmBase):
    id: int
    title: str
    warnings: Optional[List[int]] = None
    created_at: datetime

class PostPatch(OrmBase):
    title: Optional[str] = None
    description: Optional[str] = None
    categories: Optional[List[int]] = None
    warnings: Optional[List[int]] = None

class PostModPatch(OrmBase):
    categories: Optional[List[int]] = None
    warnings: Optional[List[int]] = None
    flags: List[int]
    is_flagged: bool
    is_deleted: bool

class PostDetailedOut(OrmBase):
    id: int
    title: str
    description: str
    temporary_username: str
    categories: List['CategoryOut']
    warnings: List['ContentWarningOut']
    comments: List['CommentOut']
    created_at: datetime

class PostModView(OrmBase):
    id: int
    user_id: int
    flags: List[int]
    is_flagged: bool
    is_deleted: bool
    created_at: datetime

PostDetailedOut.model_rebuild()
