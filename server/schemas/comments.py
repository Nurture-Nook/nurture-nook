from .base import OrmBase
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .warnings import ContentWarningOut

class CreateComment(OrmBase):
    content: str

class CommentOut(OrmBase):
    id: int
    temporary_username: str
    content: str
    created_at: datetime

class CommentDetailedOut(OrmBase):
    id: int
    temporary_username: str
    content: str
    created_at: datetime
    content_warning: List[ContentWarningOut]

class CommentPatch(OrmBase):
    content: Optional[str] = None
    warnings: List[int] = None

class ModView(OrmBase):
    id: int
    user_id: int
    flags: List[int]
    is_flagged: bool
    is_deleted: bool
    created_at: datetime

CommentDetailedOut.update_forward_refs()
