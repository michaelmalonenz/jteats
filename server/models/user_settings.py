from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ._base import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_num: Mapped[str] = mapped_column(String)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship()

    def to_viewmodel(self):
        return {
            'id': self.id,
            'accountNumber': self.account_num,
            'userId': self.user_id,
            'user': self.user.to_viewmodel(),
        }

    @staticmethod
    def from_viewmodel(**kwargs):
        settings = UserSettings()
        settings.id = kwargs.get('id')
        settings.user_id = kwargs.get('userId')
        settings.account_num = kwargs.get('accountNumber')
        return settings
