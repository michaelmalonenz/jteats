from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Optional[str]]
    email: Mapped[str] = mapped_column(String(250))
    external_id: Mapped[Optional[str]]
    nickname: Mapped[Optional[str]] = mapped_column(String(50))
    picture_url: Mapped[Optional[str]] = mapped_column(String(2000))
