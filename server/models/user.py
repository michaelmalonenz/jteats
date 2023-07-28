from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from ._base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(250))
    external_id: Mapped[Optional[str]] = mapped_column(String(50))
    nickname: Mapped[Optional[str]] = mapped_column(String(50))
    picture_url: Mapped[Optional[str]] = mapped_column(String(2000))
