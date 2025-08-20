"""make_email_nullable_with_unique_constraint

Revision ID: 93a5adc83648
Revises: bbaf90b12c77
Create Date: 2025-08-18 12:35:21.962412

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '93a5adc83648'
down_revision: Union[str, Sequence[str], None] = 'bbaf90b12c77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop existing unique constraint on email if it exists
    # You might need to adjust the constraint name based on your database
    op.drop_constraint('users_email_key', 'users', type_='unique')
    
    # Make email column nullable
    op.alter_column('users', 'email', 
                    existing_type=sa.String(), 
                    nullable=True)
    
    # Create a partial unique index that only applies to non-null emails
    op.create_index('ix_users_email_unique', 'users', ['email'], 
                   unique=True, 
                   postgresql_where=sa.text('email IS NOT NULL'))

def downgrade():
    # Drop the partial unique index
    op.drop_index('ix_users_email_unique', table_name='users')
    
    # Make email column non-nullable again
    op.alter_column('users', 'email', 
                    existing_type=sa.String(), 
                    nullable=False)
    
    # Restore standard unique constraint
    op.create_unique_constraint('users_email_key', 'users', ['email'])
