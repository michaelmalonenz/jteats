import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.datetime] = mapped_column(DateTime)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    closed: Mapped[bool] = mapped_column(Boolean, default=False)
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id"))
    owner: Mapped["User"] = relationship(viewonly=True)
    deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    ordered: Mapped[bool] = mapped_column(Boolean, default=False)
    order_items: Mapped[List["OrderItem"]] = relationship(
        back_populates="meal", cascade="all, delete-orphan", order_by="OrderItem.user_id"
    )

    def to_viewmodel(self):
        return {
            'id': self.id,
            'date': self.date,
            'description': self.description,
            'closed': self.closed,
            'menuId': self.menu_id,
            'ownerId': self.owner_id,
            'ordered': self.ordered,
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
        meal.ordered = kwargs.get('ordered')
        return meal
