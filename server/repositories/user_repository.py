from sqlalchemy import select
from models import User, Order, UserSettings


class UserRepository():

    def __init__(self, session):
        self.session = session

    def get_all(self):
        statement = select(User)
        return self.session.scalars(statement).all()

    def get_by_id(self, id):
        statement = select(User).where(User.id == id)
        return self.session.scalars(statement).one_or_none()

    def get_by_external_id(self, id):
        statement = select(User).where(User.external_id == id)
        return self.session.scalars(statement).one_or_none()

    def get_by_email(self, email):
        statement = select(User).where(User.email == email)
        return self.session.scalars(statement).one_or_none()

    def upsert_external_user(self, external_id, name, nickname, picture_url, email):
        statement = select(User).where(User.email == email)
        user = self.session.scalars(statement).one_or_none()
        if user is None:
            user = User(id=None, email=email)
            self.session.add(user)
        user.external_id = external_id
        user.name = name
        user.nickname = nickname
        user.picture_url = picture_url
        self.session.commit()
        self.session.refresh(user)
        return user

    def get_users_for_meal(self, meal_id):
        statement = (
            select(User)
            .join(Order)
            .where(Order.meal_id == meal_id)
        )
        return self.session.scalars(statement).all()

    def get_user_settings(self, user_id):
        statement = (
            select(UserSettings)
            .where(UserSettings.user_id == user_id)
        )
        settings = self.session.scalars(statement).one_or_none()
        if settings is None:
            settings = UserSettings()
            settings.user_id = user_id
            settings.account_num = ''
            self.session.add(settings)
            self.session.commit()
            self.session.refresh(settings)
        return settings

    def save_user_settings(self, to_update):
        statement = (
            select(UserSettings)
            .where(UserSettings.id == to_update.id)
        )
        settings = self.session.scalars(statement).one()
        settings.account_num = to_update.account_num
        self.session.commit()
        return settings
