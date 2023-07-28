from typing import Optional, List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_sections: Mapped[List["MenuSection"]] = relationship(
        back_populates="menu", cascade="all, delete-orphan"
    )
