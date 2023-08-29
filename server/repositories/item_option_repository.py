class ItemOptionRepository:
    
    def __init__(self, session):
        self.session = session

    def insert(self, option):
        self.session.add(option)
        self.session.commit()
        self.session.refresh(option)
        return option
