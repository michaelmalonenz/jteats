from sqlalchemy import select 
from models import User


class UserRepository():

    def __init__(self, session):
        self.session = session

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