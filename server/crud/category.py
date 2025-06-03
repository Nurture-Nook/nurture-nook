from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Category
from schemas.categories import CategoryCreate, CategoryOut, CategoryPatch, CategoryModView
from schemas.posts import PostOut
from typing import List

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_category(db: Session, category: CategoryCreate) -> CategoryOut:
    if not category.title:
        raise HTTPException(status_code = 400, detail = "Empty Category Title")

    db_category = Category(
        title=category.title,
        description=category.description
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    logger.info(f"Category {db_category.id} created")
    
    return CategoryOut.from_orm(db_category)

# READ
def get_category_model(db: Session, category_id: int) -> Category:
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code = 404, detail="Category not Found")
    return db_category

def get_category(db: Session, category_id: int) -> CategoryOut:
    category = get_category_model(db, category_id)
    return CategoryOut.from_orm(category)

def get_category_with_posts(db: Session, category_id: int) -> CategoryWithPosts:
    category = get_category_model(db, category_id)
    return CategoryWithPosts.from_orm(category)

def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[CategoryOut]:
    return [CategoryOut.from_orm(category) for category in db.query(Category).offset(skip).limit(limit).all()]

def get_posts_of_category(db: Session, category_id: int, skip: int = 0, limit: int = 50) -> List[PostOut]:
    return [PostOut.from_orm(post) for post in db.query(Post).filter(Post.category_id == category_id).offset(skip).limit(limit).all()]


# UPDATE
def update_category(db: Session, category_id: int, category_patch: CategoryPatch) -> CategoryModView:
    db_category = get_category_model(db, category_id)

    updates = { key: value for key, value in category_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_category, attr, value)

    db.commit()
    db.refresh(db_category)

    logger.info(f"Category {db_category.id} updated with changes: {updates}")

    return CategoryModView.from_orm(db_category)

# DELETE
def delete_category(db: Session, category_id: int) -> CategoryOut:
    category = get_category_model(db, category_id)

    category_out = CategoryOut.from_orm(category)

    db.delete(category)
    db.commit()

    logger.info(f"Category {category_out.id} deleted")

    return category_out
