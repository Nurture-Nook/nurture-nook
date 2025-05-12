from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Category
from schemas import CategoryCreate, CategoryOut, CategoryPatch, CategoryModView
from typing import List

# CREATE
def create_category(db: Session, category: CategoryCreate) -> CategoryOut:
    db_category = Category(
        title=category.title,
        description=category.description
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return CategoryOut.from_orm(db_category)

# READ
def get_category(db: Session, category_id: int) -> Category:
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not Found")
    return CategoryOut.from_orm(db_category)

def get_all_categories(db: Session) -> List[CategoryOut]:
    return [CategoryOut.from_orm(category) for category in db.query(Category).all()]

# UPDATE
def update_category(db: Session, category_id: int, category_patch: CategoryPatch) -> CategoryModView:
    category = get_category(db, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not Found")

    if category_patch.title is not None:
        category.title = category_patch.title
    if category_patch.description is not None:
        category.description = category_patch.description
    if category_patch.stat is not None:
        category.stat = category_patch.stat

    db.commit()
    db.refresh(category)
    return CategoryModView.from_orm(category)

# DELETE
def delete_category(db: Session, category_id: int) -> CategoryOut:
    category = get_category(db, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not Found")

    db.delete(category)
    db.commit()
    return CategoryOut.from_orm(category)
