from sqlalchemy import select 
from sqlalchemy.orm import Session
from models import User


class UserRepository():

    def __init__(self, engine):
        self.engine = engine

    def get_by_id(self, id):
        with Session(self.engine) as session:
            statement = select(User).where(User.id == id)
            return session.scalars(statement).one_or_none()

    def get_by_email(self, email):
        with Session(self.engine) as session:
            statement = select(User).where(User.email == email)
            return session.scalars(statement).one_or_none()

    def upsert_external_user(self, external_id, name, nickname, picture_url, email):
        with Session(self.engine) as session:
            statement = select(User).where(User.email == email)
            user = session.scalars(statement).one_or_none()
            if user is None:
                user = User(id=None, email=email)
                session.add(user)
            user.external_id = external_id
            user.name = name
            user.nickname = nickname
            user.picture_url = picture_url
            session.commit()