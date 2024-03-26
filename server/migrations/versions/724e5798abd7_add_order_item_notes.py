"""add_order_item_notes

Revision ID: 724e5798abd7
Revises: f0c2089c341a
Create Date: 2024-03-23 09:40:20.190479

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '724e5798abd7'
down_revision = 'f0c2089c341a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order_items', sa.Column('notes', sa.String(length=500), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('order_items', 'notes')
    # ### end Alembic commands ###
