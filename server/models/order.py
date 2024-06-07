from typing import List
from sqlalchemy import ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .order_item import OrderItem


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"))
    completed: Mapped[bool] = mapped_column(Boolean, default=False, server_default='false')

    user: Mapped["User"] = relationship(viewonly=True)
    meal: Mapped["Meal"] = relationship(viewonly=True)

    order_items: Mapped[List["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", order_by="OrderItem.id"
    )

    def to_viewmodel(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'mealId': self.meal_id,
            'completed': self.completed,
            'orderItems': [x.to_viewmodel() for x in self.order_items]
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = Order()
        result.id = kwargs.get('id')
        result.user_id = kwargs.get('userId')
        result.meal_id = kwargs.get('mealId')
        result.completed = kwargs.get('completed')
        result.order_items = [OrderItem.from_viewmodel(**x) for x in kwargs.get('orderItems', [])]
        return result