"""make_email_nullable_with_unique_constraint

Revision ID: 61b3eb7ae6b1
Revises: 93a5adc83648
Create Date: 2025-08-18 12:52:55.470119

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '61b3eb7ae6b1'
down_revision: Union[str, Sequence[str], None] = '93a5adc83648'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Check if constraint exists before dropping
    conn = op.get_bind()
    insp = sa.inspect(conn)
    constraints = insp.get_unique_constraints('users')
    constraint_names = [constraint['name'] for constraint in constraints]
    
    # Only drop if it exists
    if 'users_email_key' in constraint_names:
        op.drop_constraint('users_email_key', 'users', type_='unique')
    
    # Update all empty strings to NULL
    op.execute("UPDATE users SET email = NULL WHERE email = ''")
    
    # Check if index already exists before creating
    indexes = insp.get_indexes('users')
    index_names = [index['name'] for index in indexes]
    
    # Only create if it doesn't exist
    if 'ix_users_email_unique' not in index_names:
        # Create a partial unique index for non-null emails
        op.create_index('ix_users_email_unique', 'users', ['email'], 
                        unique=True,
                        postgresql_where=sa.text('email IS NOT NULL'))


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the partial unique index
    op.drop_index('ix_users_email_unique', table_name='users')
    
    # Restore standard unique constraint
    op.create_unique_constraint('users_email_key', 'users', ['email'])
