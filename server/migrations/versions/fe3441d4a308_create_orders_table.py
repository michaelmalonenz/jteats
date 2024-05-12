"""create_orders_table

Revision ID: fe3441d4a308
Revises: 724e5798abd7
Create Date: 2024-03-31 10:04:47.089695

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe3441d4a308'
down_revision = '724e5798abd7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('meal_id', sa.Integer(), nullable=False),
    sa.Column('completed', sa.Boolean(), server_default='false', nullable=False),
    sa.ForeignKeyConstraint(['meal_id'], ['meals.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('order_items', sa.Column('order_id', sa.Integer(), nullable=True))

    sql = """INSERT INTO orders (meal_id, user_id)
        (SELECT DISTINCT meal_id, user_id from order_items);"""
    op.execute(sql)

    sql = """UPDATE order_items
    SET order_id = orders.id
    FROM
        (SELECT id, user_id, meal_id FROM orders) as orders
    WHERE orders.user_id = order_items.user_id AND orders.meal_id = order_items.meal_id;"""
    op.execute(sql)

    op.execute("UPDATE orders SET completed = 't';")

    op.alter_column('order_items', 'order_id', nullable=False)

    op.drop_constraint('order_items_user_id_fkey', 'order_items', type_='foreignkey')
    op.drop_constraint('order_items_meal_id_fkey', 'order_items', type_='foreignkey')
    op.create_foreign_key(None, 'order_items', 'orders', ['order_id'], ['id'])
    op.drop_column('order_items', 'meal_id')
    op.drop_column('order_items', 'user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order_items', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('order_items', sa.Column('meal_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'order_items', type_='foreignkey')
    op.create_foreign_key('order_items_meal_id_fkey', 'order_items', 'meals', ['meal_id'], ['id'])
    op.create_foreign_key('order_items_user_id_fkey', 'order_items', 'users', ['user_id'], ['id'])
    op.drop_column('order_items', 'order_id')
    op.drop_table('orders')
    # ### end Alembic commands ###