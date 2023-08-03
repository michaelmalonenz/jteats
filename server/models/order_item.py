from typing import Optional, List
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer)
    menu_item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"))

    menu_item: Mapped["MenuItem"] = relationship(viewonly=True)
    user: Mapped["User"] = relationship(viewonly=True)
    meal: Mapped["Meal"] = relationship(viewonly=True)

    def to_viewmodel(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'menuItemId': self.menu_item_id,
            'userId': self.user_id,
            'mealId': self.meal_id
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = OrderItem()
        result.id = kwargs.get('id')
        result.quantity = kwargs.get('quantity')
        result.meal_id = kwargs.get('mealId')
        result.user_id = kwargs.get('userId')
        result.menu_item_id = kwargs.get('menuItemId')
        return result
