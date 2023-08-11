from sqlalchemy import update
from models import MenuItem


class MenuItemRepository:

    def __init__(self, session):
        self.session = session

    def insert(self, menu_item):
        self.session.add(menu_item)
        self.session.commit()
        self.session.refresh(menu_item)
        return menu_item

    def update(self, menu_item):
        statement = (
            update(MenuItem)
            .where(MenuItem.id == menu_item.id)
            .values(name=menu_item.name, description=menu_item.description, price=menu_item.price)
            .returning(MenuItem)
        )
        menu_item = self.session.scalars(statement).one()
        self.session.commit()
        return menu_item

    def delete(self, item_id):
        statement = update(MenuItem).where(MenuItem.id == item_id).values(deleted=True)
        self.session.execute(statement)
        self.session.commit()
