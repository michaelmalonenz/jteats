from typing import Optional
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer)
    menu_item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"))
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    notes: Mapped[Optional[str]] = mapped_column(String(500))

    menu_item: Mapped["MenuItem"] = relationship(viewonly=True)
    order: Mapped["Order"] = relationship(viewonly=True)

    def to_viewmodel(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'menuItemId': self.menu_item_id,
            'notes': self.notes,
            'menuItem': self.menu_item.to_viewmodel(),
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        result = OrderItem()
        result.id = kwargs.get('id')
        result.quantity = kwargs.get('quantity')
        result.menu_item_id = kwargs.get('menuItemId')
        result.notes = kwargs.get('notes')
        return result
