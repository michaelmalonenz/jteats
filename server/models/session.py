from datetime import datetime
from sqlalchemy import String, LargeBinary, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from ._base import Base


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(255))
    data: Mapped[bytes] = mapped_column(LargeBinary)
    expiry: Mapped[datetime] = mapped_column(DateTime)
