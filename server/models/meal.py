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

    def from_viewmodel(self, **kwargs):
        self.id = kwargs.get('id')
        self.date = kwargs.get('date')
        self.description = kwargs.get('description')
        self.order_items = [OrderItem.from_viewmodel(**x) for x in kwargs['orderItems']]
