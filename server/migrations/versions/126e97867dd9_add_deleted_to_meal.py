"""Add deleted to meal

Revision ID: 126e97867dd9
Revises: aa816ace99b0
Create Date: 2023-08-07 21:07:28.784329

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '126e97867dd9'
down_revision = 'aa816ace99b0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('meals', sa.Column('ordered', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('meals', sa.Column('deleted', sa.Boolean(), nullable=False, server_default='false'))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('meals', 'deleted')
    op.drop_column('meals', 'ordered')
    # ### end Alembic commands ###
