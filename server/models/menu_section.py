from typing import Optional, List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class MenuSection(Base):
    __tablename__ = "menu_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id"))
    menu: Mapped["Menu"] = relationship(back_populates="menu_sections")
    menu_items: Mapped[List["MenuItem"]] = relationship(
        back_populates="menu_section", cascade="all, delete-orphan"
    )

    def to_viewmodel(self):
        pass

    def from_viewmodel(self, **kwargs):
        pass
