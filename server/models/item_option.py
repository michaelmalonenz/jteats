from sqlalchemy import String, ForeignKey, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base

class ItemOption(Base):
    __tablename__ = "item_options"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    price: Mapped[float] = mapped_column(Float)
    deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default='false')
    menu_item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"))
    menu_item: Mapped["MenuItem"] = relationship(back_populates="item_options")

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'menuItemId': self.menu_item_id,
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = ItemOption()
        result.id = kwargs.get('id')
        result.name = kwargs.get('name')
        result.price = kwargs.get('price')
        result.menu_item_id = kwargs.get('menuItemId')
