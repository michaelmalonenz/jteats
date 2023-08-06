from sqlalchemy import select, insert, update
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

    def close_orders(self, meal_id):
        statement = (
            update(Meal)
            .where(Meal.id == meal_id)
            .values(closed=True)
            .returning(Meal)
        )
        order = self.session.scalars(statement).one()
        self.session.commit()
        return order
