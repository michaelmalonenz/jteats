from typing import Optional, List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .menu_item import MenuItem


class MenuSection(Base):
    __tablename__ = "menu_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id"))
    menu: Mapped["Menu"] = relationship(back_populates="menu_sections")
    menu_items: Mapped[List["MenuItem"]] = relationship(
        back_populates="menu_section", cascade="all, delete-orphan", order_by="MenuItem.id"
    )

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'menuId': self.menu_id,
            'menuItems': [x.to_viewmodel() for x in self.menu_items],
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = MenuSection()
        result.id = kwargs.get('id')
        result.name = kwargs.get('name')
        result.description = kwargs.get('description')
        result.menu_id = kwargs.get('menuId')
        result.menu_items = [MenuItem.from_viewmodel(x) for x in kwargs.get('menuItems', [])]
        return result
