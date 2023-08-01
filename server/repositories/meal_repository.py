from sqlalchemy import select, insert
from models import Meal


class MealRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(Meal).order_by(Meal.date.desc())
        return self.session.scalars(statement).all()

    def insert(self, meal):
        self.session.add(meal)
        self.session.commit()
        self.session.refresh(meal)
        return meal
