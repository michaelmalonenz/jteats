from sqlalchemy import select
from models import OrderItem


class OrderItemRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(OrderItem)
        return self.session.scalars(statement).all()

    def insert(self, orderItem):
        self.session.add(orderItem)
        self.session.commit()
        self.session.refresh(orderItem)
        return orderItem

    def get_user_items_for_meal(self, meal_id, user_id):
        statement = (
            select(OrderItem)
            .where(OrderItem.meal_id == meal_id and OrderItem.user_id == user_id)
        )
        return self.session.scalars(statement).all()
