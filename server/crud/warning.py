from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import ContentWarning
from schemas import WarningCreate, WarningOut, WarningPatch, WarningModView
from typing import List

# CREATE
def create_warning(db: Session, warning: WarningCreate) -> WarningOut:
    db_warning = ContentWarning(
        title=warning.title,
        description=warning.description
    )

    db.add(db_warning)
    db.commit()
    db.refresh(db_warning)
    
    return WarningOut.from_orm(db_warning)

# READ
def get_warning(db: Session, warning_id: int) -> WarningOut:
    db_warning = db.query(ContentWarning).filter(ContentWarning.id == warning_id).first()
    if not db_warning:
        raise HTTPException(status_code = 404, detail = "Content Warning not Found")
    return WarningOut.from_orm(db_warning)

def get_all_warnings(db: Session) -> List[WarningOut]:
    return [WarningOut.from_orm(warning) for warning in db.query(ContentWarning).all()]

# UPDATE
def update_warning(db: Session, warning_id: int, warning_patch: WarningPatch) -> WarningModView:
    warning = get_warning(db, warning_id)

    if warning_patch.title is not None:
        warning.title = warning_patch.title
    if warning_patch.description is not None:
        warning.description = warning_patch.description
    if warning_patch.stat is not None:
        warning.stat = warning_patch.stat

    db.commit()
    db.refresh(warning)
    return WarningModView.from_orm(warning)

# DELETE
def delete_warning(db: Session, warning_id: int) -> WarningOut:
    warning = get_warning(db, warning_id)

    db.delete(warning)
    db.commit()
    return WarningOut.from_orm(warning)
