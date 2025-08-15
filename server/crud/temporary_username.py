from server.middleware import logger_middleware
from sqlalchemy.orm import Session
from ..models import TemporaryUsername
from ..utils.alias import generate_alias

logger = logger_middleware.getLogger(__name__)
logger.setLevel(logger_middleware.INFO)

def create_alias(db: Session, user_id: int, post_id: int) -> str:
    try:
        # Check if we already have an alias for this user and post
        existing = db.query(TemporaryUsername).filter_by(user_id=user_id, post_id=post_id).first()
        if existing:
            logger.info(f"Using existing alias '{existing.alias}' for user {user_id}, post {post_id}")
            return existing.alias

        # Get existing aliases for this post to avoid duplicates
        try:
            # Try with scalars() method (SQLAlchemy 1.4+)
            existing_aliases_query = db.query(TemporaryUsername.alias).filter_by(post_id=post_id).distinct()
            try:
                existing_aliases = set(existing_aliases_query.scalars().all())
            except AttributeError:
                # Fallback for SQLAlchemy 1.3 or earlier
                existing_aliases = set([row[0] for row in existing_aliases_query.all()])
        except Exception as e:
            logger.warning(f"Error getting existing aliases: {str(e)}. Using empty set.")
            existing_aliases = set()

        # Generate a new unique alias
        alias = generate_alias(existing_aliases)
        logger.info(f"Generated new alias '{alias}' for user {user_id}, post {post_id}")

        # Create and save the temporary username
        temp_alias = TemporaryUsername(
            user_id=user_id,
            post_id=post_id,
            alias=alias
        )

        db.add(temp_alias)
        db.commit()
        logger.info(f"Temporary username '{alias}' created and saved")
        
        return alias
    except Exception as e:
        logger.error(f"Error in create_alias: {str(e)}")
        # If all else fails, use a simple deterministic alias
        import hashlib
        fallback_alias = f"user_{hashlib.md5(f'{user_id}_{post_id}'.encode()).hexdigest()[:8]}"
        logger.info(f"Using fallback alias '{fallback_alias}'")
        return fallback_alias
