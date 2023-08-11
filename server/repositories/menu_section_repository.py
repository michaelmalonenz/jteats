from sqlalchemy import update
from models import MenuSection


class MenuSectionRepository:

    def __init__(self, session):
        self.session = session

    def insert(self, menu_section):
        self.session.add(menu_section)
        self.session.commit()
        self.session.refresh(menu_section)
        return menu_section

    def update(self, menu_section):
        statement = (
            update(MenuSection)
            .where(MenuSection.id == menu_section.id)
            .values(name=menu_section.name, description=menu_section.description)
            .returning(MenuSection)
        )
        menu_section = self.session.scalars(statement).one()
        self.session.commit()

        return menu_section

    def delete(self, section_id):
        statement = update(MenuSection).where(MenuSection.id == section_id).values(deleted=True)
        self.session.execute(statement)
        self.session.commit()
