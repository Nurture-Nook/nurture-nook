from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import ContentWarning
from schemas import WarningCreate, WarningOut, WarningPatch, WarningModView
from typing import List

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_warning(db: Session, warning: WarningCreate) -> WarningOut:
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
    
    return WarningOut.from_orm(db_warning)

# READ
def get_warning_model(db: Session, warning_id: int) -> ContentWarning:
    db_warning = db.query(ContentWarning).filter(ContentWarning.id == warning_id).first()
    if not db_warning:
        raise HTTPException(status_code = 404, detail="Content Warning not Found")
    return db_warning

def get_warning(db: Session, warning_id: int) -> WarningOut:
    warning = get_warning_model(db, warning_id)
    return WarningOut.from_orm(warning)

def get_all_warnings(db: Session) -> List[WarningOut]:
    return [WarningOut.from_orm(warning) for warning in db.query(ContentWarning).all()]

# UPDATE
def update_warning(db: Session, warning_id: int, warning_patch: WarningPatch) -> WarningModView:
    db_warning = get_warning_model(db, warning_id)

    updates = { key: value for key, value in warning_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_warning, attr, value)

    db.commit()
    db.refresh(db_warning)

    logger.info(f"Content Warning updated with changes: {updates}")

    return WarningModView.from_orm(db_warning)

# DELETE
def delete_warning(db: Session, warning_id: int) -> WarningOut:
    warning = get_warning_model(db, warning_id)
    
    warning_out = WarningOut.from_orm(warning)

    db.delete(warning)
    db.commit()

    logger.info(f"Content Warning {warning_out.id} deleted")

    return warning_out
