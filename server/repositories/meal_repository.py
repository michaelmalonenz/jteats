from sqlalchemy import select, update, func
from models import Meal


class MealRepository:
    
    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = (
            select(Meal)
            .where(Meal.deleted == False)
            .order_by(Meal.date.desc())
        )
        return self.session.scalars(statement).all()

    def update(self, meal):
        statement = (
            update(Meal)
            .where(Meal.id == meal.id)
            .where(Meal.deleted == False)
            .values(
                date=meal.date,
                description=meal.description,
                owner_id=meal.owner_id,
                menu_id=meal.menu_id
            )
            .returning(Meal)
        )
        meal = self.session.scalars(statement).one()
        self.session.commit()

        return meal

    def delete(self, meal_id):
        statement = update(Meal).where(Meal.id == meal_id).values(deleted=True)
        self.session.execute(statement)
        self.session.commit()

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
