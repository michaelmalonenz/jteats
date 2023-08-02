from typing import Optional, List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_section_id: Mapped[int] = mapped_column(ForeignKey("menu_sections.id"))
    menu_section: Mapped["MenuSection"] = relationship(back_populates="menu_items")

    def to_viewmodel(self):
        return {
            'id': self.id,
            'description': self.description,
            'name': self.name,
            'menuSectionId': self.menu_section_id,
            'menuId': self.menu_section.menu_id,
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        pass
