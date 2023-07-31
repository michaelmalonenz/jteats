from functools import wraps
import json
import logging
from flask import Flask, render_template, g, session, redirect, request, send_from_directory
from flask_session import Session
from flask_dotenv import DotEnv
from sqlalchemy import create_engine
from dbconfig import get_db_url

from authlib.integrations.flask_client import OAuth
from api import API_APP
from repositories import UserRepository


LOGGER = logging.getLogger(__name__)

app = Flask(__name__)
env = DotEnv()
env.init_app(app)
app.register_blueprint(API_APP, url_prefix='/api')
oauth = OAuth(app)

app.config['SESSION_TYPE'] = 'filesystem'
server_session = Session(app)

with open('./oauth-config.json') as inf:
    oauth_conf = json.load(inf)

AUTH0_DOMAIN = oauth_conf['domain']

auth0 = oauth.register(
    'auth0',
    client_id=oauth_conf['clientID'],
    client_secret=oauth_conf['clientSecret'],
    api_base_url=f'https://{AUTH0_DOMAIN}',
    access_token_url=f'https://{AUTH0_DOMAIN}/oauth/token',
    authorize_url=f'https://{AUTH0_DOMAIN}/authorize',
    client_kwargs={
        'scope': 'openid profile email',
    },
    server_metadata_url=f'https://{AUTH0_DOMAIN}/.well-known/openid-configuration'
)


@app.route('/auth/callback')
def callback_handling():
    # Handles response from token endpoint
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    session['jwt_payload'] = userinfo
    session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo['name'],
        'picture': userinfo['picture']
    }

    UserRepository(g.db).upsert_external_user(
        userinfo['sub'],
        userinfo['name'],
        userinfo['nickname'],
        userinfo['picture'],
        userinfo['email'])

    return redirect('/')


@app.route('/login')
def login():
    return auth0.authorize_redirect(redirect_uri=oauth_conf['callbackURL'])

@app.before_request
def connect_to_db():
    g.db = create_engine(get_db_url())
    if 'profile' in session:
        g.current_user_id = session['profile']['user_id']


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'profile' not in session:
            return redirect('/login')
        return f(*args, **kwargs)

    return decorated


@app.route('/', methods=['GET'])
@requires_auth
def index():
    return render_template('index.html')

@requires_auth
@app.route('/<path:path>', methods=['GET'])
def send_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    app.run(host="0.0.0.0", debug=True)
