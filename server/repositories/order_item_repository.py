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
