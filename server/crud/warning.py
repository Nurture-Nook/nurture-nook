from fastapi import HTTPException
from server.middleware import logging
from sqlalchemy.orm import Session
from models import ContentWarning, Post
from schemas.warnings import ContentWarningCreate, ContentWarningOut, ContentWarningPatch, ContentWarningModView, ContentWarningWithPosts
from schemas.posts import PostOut
from typing import List

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_warning(db: Session, warning: ContentWarningCreate) -> ContentWarningOut:
    if not warning.title:
        raise HTTPException(status_code = 400, detail = "Empty Content Warning Title")

    db_warning = ContentWarning(
        title=warning.title,
        description=warning.description
    )

    db.add(db_warning)
    db.commit()
    db.refresh(db_warning)

    logger.info(f"Content Warning {db_warning.id} created")
    
    return ContentWarningOut.model_validate(db_warning)

# READ
def get_warning_model(db: Session, warning_id: int) -> ContentWarning:
    db_warning = db.query(ContentWarning).filter(ContentWarning.id == warning_id).first()
    if not db_warning:
        raise HTTPException(status_code = 404, detail="Content Warning not Found")
    return db_warning

def get_warning(db: Session, warning_id: int) -> ContentWarningOut:
    warning = get_warning_model(db, warning_id)
    return ContentWarningOut.model_validate(warning)

def get_warning_with_posts(db: Session, warning_id: int) -> ContentWarningWithPosts:
    warning = get_warning_model(db, warning_id)
    return ContentWarningWithPosts.model_validate(warning)

def get_all_warnings(db: Session, skip: int = 0, limit: int = 100) -> List[ContentWarningOut]:
    return [ContentWarningOut.model_validate(warning) for warning in db.query(ContentWarning).offset(skip).limit(limit).all()]

def get_posts_of_warning(db: Session, warning_id: int, skip: int = 0, limit: int = 50) -> List[PostOut]:
    return [PostOut.model_validate(post) for post in db.query(Post).filter(Post.warning_id == warning_id).offset(skip).limit(limit).all()]

# UPDATE
def update_warning(db: Session, warning_id: int, warning_patch: ContentWarningPatch) -> ContentWarningModView:
    db_warning = get_warning_model(db, warning_id)

    updates = { key: value for key, value in warning_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_warning, attr, value)

    db.commit()
    db.refresh(db_warning)

    logger.info(f"Content Warning updated with changes: {updates}")

    return ContentWarningModView.model_validate(db_warning)

# DELETE
def delete_warning(db: Session, warning_id: int) -> ContentWarningOut:
    warning = get_warning_model(db, warning_id)
    
    warning_out = ContentWarningOut.model_validate(warning)

    db.delete(warning)
    db.commit()

    logger.info(f"Content Warning {warning_out.id} deleted")

    return warning_out
