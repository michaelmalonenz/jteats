from typing import Optional, List
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .order_item import OrderItem


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    date = mapped_column(DateTime)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    order_items: Mapped[List["OrderItem"]] = relationship()

    def to_viewmodel(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'orderItems': [OrderItem.to_viewmodel(x) for x in self.order_items],
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        meal = Meal()
        meal.id = kwargs.get('id')
        meal.date = kwargs.get('date')
        meal.description = kwargs.get('description')
        meal.order_items = [OrderItem.from_viewmodel(**x) for x in kwargs['orderItems']]
        return meal
