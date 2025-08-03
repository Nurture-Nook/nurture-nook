from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Comment, User
from schemas.comments import CommentCreate, CommentOut, CommentPatch, CommentModPatch, CommentModView
from crud.temporary_username import create_alias
from typing import List
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_comment(db: Session, comment: CommentCreate) -> CommentOut:
    if not comment.content:
        raise HTTPException(status_code = 400, detail = "Empty Comment Content")

    db_comment = Comment(
        content=comment.content,
        warnings=comment.warnings,
        user_id=comment.user_id,
        post_id=comment.post_id,
        temporary_username=create_alias(db, comment.user_id, comment.post_id)
    )

    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    logger.info(f"User {db_comment.temporary_username} successfully added comment {db_comment.id}.")
    
    return CommentOut.from_orm(db_comment)

# READ
def get_comment_model(db: Session, comment_id: int) -> Comment:
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code = 404, detail="Comment not Found")
    return db_comment

def get_comment(db: Session, comment_id: int) -> CommentOut:
    comment = get_comment_model(db, comment_id)
    return CommentOut.from_orm(comment)

def get_comment_as_mod(db: Session, comment_id: int) -> CommentModView:
    comment = get_comment_model(db, comment_id)
    return CommentModView.from_orm(comment)

def get_all_comments(db: Session, skip: int = 0, limit: int = 100) -> List[CommentOut]:
    return [CommentOut.from_orm(comment) for comment in db.query(Comment).offset(skip).limit(limit).all()]

# UPDATE
def update_comment(db: Session, comment_id: int, comment_patch: CommentPatch, current_user_id: int) -> CommentOut:
    db_comment = get_comment_model(db, comment_id)

    if db_comment.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this comment")

    updates = { key: value for key, value in comment_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_comment, attr, value)

    db.commit()
    db.refresh(db_comment)

    logger.info(f"User {db_comment.temporary_username} successfully updated comment {db_comment.id} with changes: {updates}")

    return CommentOut.from_orm(db_comment)

def update_comment_as_mod(db: Session, comment_id: int, comment_patch: CommentModPatch) -> CommentModView:
    db_comment = get_comment_model(db, comment_id)

    updates = { key: value for key, value in comment_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_comment, attr, value)

    db.commit()
    db.refresh(db_comment)

    logger.info(f"Moderator successfully updated comment {db_comment.id} with changes: {updates}")

    return CommentModView.from_orm(db_comment)

# DELETE
def delete_comment(db: Session, comment_id: int, current_user: User) -> CommentOut:
    db_comment = get_comment_model(db, comment_id)

    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this comment")

    comment_out = CommentOut.from_orm(db_comment)

    db.delete(db_comment)
    db.commit()

    logger.info(f"Comment {comment_id} deleted")

    return comment_out
