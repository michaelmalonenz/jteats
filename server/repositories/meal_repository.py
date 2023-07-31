from sqlalchemy import select, insert
from sqlalchemy.orm import Session
from models import Meal


class MealRepository:
    
    def __init__(self, engine):
        self.engine = engine

    def get_all(self):
        with Session(self.engine) as session:
            statement = select(Meal)
            return session.scalars(statement).all()

    def insert(self, meal):
        with Session(self.engine) as session:
            session.add(meal)
            session.commit()
            session.flush()
            session.refresh(meal)
            return meal
