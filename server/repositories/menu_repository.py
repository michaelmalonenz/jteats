from sqlalchemy import select 
from models import Menu


class MenuRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(Menu)
        return self.session.scalars(statement).all()

    def insert(self, menu):
        self.session.add(menu)
        self.session.commit()
        self.session.refresh(menu)
        return menu

    def update(self, menu):
        self.session.add(menu)
        self.session.commit()
        self.session.refresh(menu)
        return menu
