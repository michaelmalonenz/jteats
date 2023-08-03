import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .order_item import OrderItem


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.datetime] = mapped_column(DateTime)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id"))
    menu: Mapped["Menu"] = relationship()
    order_items: Mapped[List["OrderItem"]] = relationship()

    owner: Mapped["User"] = relationship(viewonly=True)

    def to_viewmodel(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'menuId': self.menu_id,
            'menu': self.menu.to_viewmodel(),
            'ownerId': self.owner_id,
            'orderItems': [x.to_viewmodel() for x in self.order_items],
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        meal = Meal()
        meal.id = kwargs.get('id')
        meal.date = kwargs.get('date')
        meal.description = kwargs.get('description')
        meal.menu_id = kwargs.get('menuId')
        meal.owner_id = kwargs.get('ownerId')
        meal.order_items = [OrderItem.from_viewmodel(**x) for x in kwargs['orderItems']]
        return meal
