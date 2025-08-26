from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import Comment, ContentWarning, User
from ..schemas.comments import CommentCreate, CommentOut, CommentPatch, CommentModPatch, CommentModView
from ..crud.temporary_username import create_alias
from typing import List
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_comment(db: Session, comment: CommentCreate) -> CommentOut:
    if not comment.content:
        raise HTTPException(status_code = 400, detail = "Empty Comment Content")
    
    warnings=[]
    if comment.warnings:
        warnings = db.query(ContentWarning).filter(ContentWarning.id.in_(comment.warnings)).all()

    db_comment = Comment(
        content=comment.content,
        warnings=warnings,
        parent_comment_id = comment.parent_comment_id or None,
        user_id=comment.user_id,
        post_id=comment.post_id,
        temporary_username=create_alias(db, comment.user_id, comment.post_id)
    )

    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    logger.info(f"User {db_comment.temporary_username} successfully added comment {db_comment.id}.")
    
    return CommentOut(
        id=db_comment.id,
        content=db_comment.content,
        warnings=[w.id for w in db_comment.warnings],
        parent_comment_id=db_comment.parent_comment_id,
        user_id=db_comment.user_id,
        post_id=db_comment.post_id,
        temporary_username=db_comment.temporary_username,
        created_at=db_comment.created_at,
        replies=[]
    )

# READ
def get_comment_model(db: Session, comment_id: int) -> Comment:
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code = 404, detail="Comment not Found")
    return db_comment

def get_comment(db: Session, comment_id: int) -> CommentOut:
    comment = get_comment_model(db, comment_id)

    return CommentOut(
        id=comment.id,
        content=comment.content,
        temporary_username=comment.temporary_username,
        user_id=comment.user_id,
        post_id=comment.post_id,
        parent_comment_id=comment.parent_comment_id or None,
        warnings=[w.id for w in comment.warnings],
        created_at=comment.created_at,
        replies=[
            CommentOut(
                id=reply.id,
                content=reply.content,
                temporary_username=reply.temporary_username,
                user_id=reply.user_id,
                post_id=reply.post_id,
                parent_comment_id=reply.parent_comment_id,
                warnings=[w.id for w in reply.warnings],
                created_at=reply.created_at,
                replies=[]
            )
            for reply in comment.replies
        ]
    )

def get_comment_as_mod(db: Session, comment_id: int) -> CommentModView:
    comment = get_comment_model(db, comment_id)
    return CommentModView.model_validate(comment)

def get_all_comments(db: Session, skip: int = 0, limit: int = 100) -> List[CommentOut]:
    return [CommentOut.model_validate(comment) for comment in db.query(Comment).offset(skip).limit(limit).all()]

# UPDATE
def update_comment(db: Session, comment_id: int, comment_patch: CommentPatch, current_user_id: int) -> CommentOut:
    db_comment = get_comment_model(db, comment_id)

    if db_comment.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this comment")

    updates = { key: value for key, value in comment_patch.model_dump(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_comment, attr, value)

    db.commit()
    db.refresh(db_comment)

    logger.info(f"User {db_comment.temporary_username} successfully updated comment {db_comment.id} with changes: {updates}")

    return CommentOut.model_validate(db_comment)

def update_comment_as_mod(db: Session, comment_id: int, comment_patch: CommentModPatch) -> CommentModView:
    db_comment = get_comment_model(db, comment_id)

    updates = { key: value for key, value in comment_patch.model_dump(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_comment, attr, value)

    db.commit()
    db.refresh(db_comment)

    logger.info(f"Moderator successfully updated comment {db_comment.id} with changes: {updates}")

    return CommentModView.model_validate(db_comment)

def delete_comment(db: Session, comment_id: int, current_user: User) -> CommentOut:
    db_comment = get_comment_model(db, comment_id)

    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You Are Not Authorized to Delete This Comment")

    db_comment.content = "This comment has been deleted."
    db_comment.is_deleted = True

    db.commit()
    db.refresh(db_comment)

    logger.info(f"Comment {comment_id} Soft Deleted")

    return CommentOut(
        id=db_comment.id,
        user_id=db_comment.user_id,
        post_id=db_comment.post_id,
        temporary_username=db_comment.temporary_username,
        content=db_comment.content,
        warnings=[w.id for w in db_comment.warnings],
        parent_comment_id=db_comment.parent_comment_id or None,
        is_deleted=db_comment.is_deleted,
        created_at=db_comment.created_at,
        replies=[CommentOut.model_validate(reply) for reply in db_comment.replies]
    )

# DELETE
def delete_comment_as_mod(db: Session, comment_id: int) -> CommentOut:
    db_comment = get_comment_model(db, comment_id)

    comment_out = CommentOut.model_validate(db_comment)

    for child in db_comment.replies:
        child.parent_comment_id = None

    db.delete(db_comment)
    db.commit()

    logger.info(f"Comment {comment_id} deleted")

    return comment_out
