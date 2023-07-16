import json
from sqlalchemy import URL


DB_CONFIG = None


def _read_db_config():
    global DB_CONFIG
    if DB_CONFIG is None:
        with open('dbconfig.json') as inf:
            DB_CONFIG = json.load(inf)
    return DB_CONFIG


def get_db_url():
    return URL.create(
        "postgresql+psycopg2",
        **_read_db_config())
