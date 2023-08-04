from sqlalchemy import select, delete
from models import OrderItem


class OrderItemRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(OrderItem)
        return self.session.scalars(statement).all()

    def _get_existing(self, order_item):
        statement = (
            select(OrderItem)
            .where(
                OrderItem.meal_id == order_item.meal_id and
                OrderItem.user_id == order_item.user_id and
                OrderItem.menu_item_id == order_item.menu_item_id
            )
        )
        return self.session.scalars(statement).one_or_none()

    def add_order_item(self, order_item):
        existing = self._get_existing(order_item)
        if existing is not None:
            existing.quantity += 1
            self.session.commit()
            return existing

        self.session.add(order_item)
        self.session.commit()
        self.session.refresh(order_item)
        return order_item

    def remove_order_item(self, order_item):
        existing = self._get_existing(order_item)
        if existing is None:
            return None
        existing.quantity -= 1
        if existing.quantity == 0:
            statement = delete(OrderItem).where(OrderItem.id == existing.id)
            self.session.execute(statement)
            existing = None
        self.session.commit()
        return existing

    def get_user_items_for_meal(self, meal_id, user_id):
        statement = (
            select(OrderItem)
            .where(OrderItem.meal_id == meal_id and OrderItem.user_id == user_id)
        )
        return self.session.scalars(statement).all()
