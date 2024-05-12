from models import Order, Meal
from sqlalchemy import select


class OrderRepository:
    
    def __init__(self, session):
        self.session = session

    def _get_existing(self, meal_id, user_id):
        statement = (
            select(Order)
            .where(Order.meal_id == meal_id)
            .where(Order.user_id == user_id)
        )
        return self.session.scalars(statement).one_or_none()

    def ensure_order(self, meal_id, user_id):
        existing = self._get_existing(meal_id, user_id)
        if existing != None:
            return existing
        order = Order()
        order.meal_id = meal_id
        order.user_id = user_id
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order

    def get_user_order_for_meal(self, meal_id, user_id):
        return self._get_existing(meal_id, user_id)
