from models import Order, OrderItem
from sqlalchemy import select, delete, update


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
        return self.ensure_order(meal_id, user_id)

    def get_orders_for_meal(self, meal_id):
        statement = (
            select(Order)
            .where(Order.meal_id == meal_id)
        )
        return self.session.scalars(statement).all()

    def remove_order_item(self, order_id, item_id):
        statement = (
            select(OrderItem)
            .where(OrderItem.order_id == order_id)
            .where(OrderItem.id == item_id)
        )
        existing = self.session.scalars(statement).one_or_none()
        if existing is None:
            return None
        existing.quantity -= 1
        if existing.quantity == 0:
            statement = delete(OrderItem).where(OrderItem.id == existing.id)
            self.session.execute(statement)
            existing = None
        self.session.commit()
        return existing

    def update_order(self, order):
        statement = (
            update(Order)
            .where(Order.id == order.id)
            .values(completed=order.completed)
        )
        self.session.execute(statement)

        for item in order.order_items:
            statement = (
                update(OrderItem)
                .where(OrderItem.id == item.id)
                .values(notes=item.notes)
            )
            self.session.execute(statement)
        self.session.commit()
        pass
