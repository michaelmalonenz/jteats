from typing import Optional, List
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ._base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer)
    menu_item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"))
