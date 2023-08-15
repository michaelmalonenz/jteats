# JTEats

## Get Started

- install postgresql, python3, pip (possibly python-virtualenv), node / npm
- `npm install -g aurelia-cli`
- `createdb jteats`
- `psql jteats`
```SQL
CREATE USER jteats WITH ENCRYPTED PASSWORD 'Sup3rS3cret';
GRANT ALL PRIVILEGES ON DATABASE jteats TO jteats;
GRANT ALL ON SCHEMA public TO jteats;`
```

- copy dbconfig.json.example to dbconfig.json and fill in the details as above
- copy oauth-config.json.example to oauth-config.json and fill in the details (it doesn't have to be "the" auth0 tenant, just _an_ auth0 tenant is fine)
- in server run the following:
    - `pip install -r requirements_dev.in`
    - `alembic upgrade head` (errors here suggest your dbconfig is incorrect)
- in client 
    - `npm install`
    - `au build`


## Development
To run the app in development mode, run the following two commands:
- in client: `au build --watch`
- in server: `python app.py`
after which, the app should be accessible at http://localhost:5000
