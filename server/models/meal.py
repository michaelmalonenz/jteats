from typing import Optional, List
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    date = mapped_column(DateTime)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    order_items: Mapped[List["OrderItem"]] = relationship()
