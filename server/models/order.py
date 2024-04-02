from typing import List
from sqlalchemy import ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


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