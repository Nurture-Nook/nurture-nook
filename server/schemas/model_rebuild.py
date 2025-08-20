from .categories import CategoryWithPosts
from .posts import PostOut, PostDetailedOut
from .comments import CommentOut
from .warnings import ContentWarningWithPosts, ContentWarningWithComments
from .users import UserWithContent

CategoryWithPosts.model_rebuild()
PostOut.model_rebuild()
PostDetailedOut.model_rebuild()
CommentOut.model_rebuild()
ContentWarningWithPosts.model_rebuild()
ContentWarningWithComments.model_rebuild()
UserWithContent.model_rebuild()
