import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .order_item import OrderItem


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.datetime] = mapped_column(DateTime)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    closed: Mapped[bool] = mapped_column(Boolean, default=False)
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id"))
    owner: Mapped["User"] = relationship(viewonly=True)

    def to_viewmodel(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'closed': self.closed,
            'menuId': self.menu_id,
            'ownerId': self.owner_id,
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        meal = Meal()
        meal.id = kwargs.get('id')
        meal.date = kwargs.get('date')
        meal.description = kwargs.get('description')
        meal.closed = kwargs.get('closed')
        meal.menu_id = kwargs.get('menuId')
        meal.owner_id = kwargs.get('ownerId')
        return meal
