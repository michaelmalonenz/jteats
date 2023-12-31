from typing import Optional, List
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base
from .menu_section import MenuSection


class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True)
    restaurant: Mapped[Optional[str]] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(String(500))
    deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default='false')
    menu_sections: Mapped[List["MenuSection"]] = relationship(
        back_populates="menu", cascade="all, delete-orphan", order_by="MenuSection.id",
        primaryjoin='and_(Menu.id == MenuSection.menu_id, MenuSection.deleted == False)'
    )

    def to_viewmodel(self):
        return {
            'id': self.id,
            'restaurant': self.restaurant,
            'description': self.description,
            'menuSections': [x.to_viewmodel() for x in self.menu_sections]
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = Menu()
        result.id = kwargs.get('id')
        result.restaurant = kwargs.get('restaurant')
        result.description = kwargs.get('description')
        result.menu_sections = [MenuSection.from_viewmodel(x) for x in kwargs.get('menuSections', [])]
        return result
