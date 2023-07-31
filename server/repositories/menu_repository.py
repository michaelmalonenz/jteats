from sqlalchemy import select 
from sqlalchemy.orm import Session
from models import Menu


class MenuRepository:
    
    def __init__(self, engine):
        self.engine = engine

    def get_all(self):
        with Session(self.engine) as session:
            statement = select(Menu)
            return session.scalars(statement).all()
