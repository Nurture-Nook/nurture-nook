from server.middleware import logger_middleware
from sqlalchemy.orm import Session
from ..models import TemporaryUsername
from ..utils.alias import generate_alias

logger = logger_middleware.getLogger(__name__)
logger.setLevel(logger_middleware.INFO)

def create_alias(db: Session, user_id: int, post_id: int) -> str:
    existing = db.query(TemporaryUsername).filter_by(user_id = user_id, post_id = post_id).first()
    if existing:
        return existing.alias

    existing_aliases = set(db.query(TemporaryUsername.alias).filter_by(post_id=post_id).distinct().scalars().all())
    alias = generate_alias(existing_aliases)

    temp_alias = TemporaryUsername(
        user_id=user_id,
        post_id=post_id,
        alias=alias
    )

    logger.info(f"Temporary username '{alias}' created")

    db.add(temp_alias)
    db.commit()
    return alias
