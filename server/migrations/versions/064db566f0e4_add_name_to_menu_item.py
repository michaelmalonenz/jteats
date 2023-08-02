"""add name to menu item

Revision ID: 064db566f0e4
Revises: e33447b14a56
Create Date: 2023-08-02 15:47:33.775112

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '064db566f0e4'
down_revision = 'e33447b14a56'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('menu_items', sa.Column('name', sa.String(length=100), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('menu_items', 'name')
    # ### end Alembic commands ###
