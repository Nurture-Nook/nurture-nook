from .base import OrmBase, Approval
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .posts import PostOut
    from.comments import CommentOut

class ContentWarningCreate(OrmBase):
    title: str
    description: str

class ContentWarningOut(OrmBase):
    id: int
    title: str
    description: str
    created_at: datetime

class ContentWarningPatch(OrmBase):
    title: Optional[str]
    description: Optional[str]

class ContentWarningWithPosts(OrmBase):
    id: int
    title: str
    description: str
    posts: List['PostOut']
    created_at: datetime

class ContentWarningWithComments(OrmBase):
    id: int
    title: str
    description: str
    comments: List['CommentOut']
    created_at: datetime

class ContentWarningModView(OrmBase):
    id: int
    title: str
    description: str
    stat: Approval

ContentWarningWithPosts.update_forward_refs()
ContentWarningWithComments.update_forward_refs()
