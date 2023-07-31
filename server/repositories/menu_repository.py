from sqlalchemy import select 
from models import Menu


class MenuRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(Menu)
        return self.session.scalars(statement).all()
