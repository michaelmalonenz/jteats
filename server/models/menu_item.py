from typing import Optional, List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_section_id: Mapped[int] = mapped_column(ForeignKey("menu_sections.id"))
    menu_section: Mapped["MenuSection"] = relationship(back_populates="menu_items")

    def to_viewmodel(self):
        pass

    def from_viewmodel(self, **kwargs):
        pass
