"""Add user table

Revision ID: 350602487d21
Revises: 
Create Date: 2023-07-18 22:34:48.138408

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '350602487d21'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('external_id', sa.String(50), nullable=True),
        sa.Column('email', sa.String(250), nullable=True),
        sa.Column('name', sa.String(100), nullable=True),
        sa.Column('nickname', sa.String(50), nullable=True),
        sa.Column('picture_url', sa.String(2000), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('users')
