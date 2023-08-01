class MenuSectionRepository:

    def __init__(self, session):
        self.session = session

    def insert(self, menu_section):
        self.session.add(menu_section)
        self.session.commit()
        self.session.refresh(menu_section)
        return menu_section
