from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Comment
from schemas.comments import CommentCreate, CommentOut, CommentPatch, CommentModPatch, CommentModView
from crud.temporary_username import create_alias
from typing import List

# CREATE
def create_comment(db: Session, comment: CommentCreate) -> CommentOut:
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

def get_all_comments(db: Session) -> List[CommentOut]:
    return [CommentOut.from_orm(comment) for comment in db.query(Comment).all()]

# UPDATE
def update_comment(db: Session, comment_id: int, comment_patch: CommentPatch) -> CommentOut:
    comment = get_comment_model(db, comment_id)

    if comment_patch.title is not None:
        comment.title = comment_patch.title
    if comment_patch.description is not None:
        comment.description = comment_patch.description
    if comment_patch.warnings is not None:
        comment.warnings = comment_patch.warnings

    db.commit()
    db.refresh(comment)
    return CommentOut.from_orm(comment)

def update_comment_as_mod(db: Session, comment_id: int, comment_patch: CommentModPatch) -> CommentModView:
    comment = get_comment_model(db, comment_id)

    if comment_patch.warnings is not None:
        comment.warnings = comment_patch.warnings
    if comment_patch.flags is not None:
        comment.flags = comment_patch.flags
    if comment_patch.is_flagged is not None:
        comment.is_flagged = comment_patch.is_flagged
    if comment_patch.is_deleted is not None:
        comment.is_deleted = comment_patch.is_deleted

    db.commit()
    db.refresh(comment)
    return CommentModView.from_orm(comment)

# DELETE
def delete_comment(db: Session, comment_id: int) -> CommentOut:
    comment = get_comment_model(db, comment_id)

    db.delete(comment)
    db.commit()
    return CommentOut.from_orm(comment)
