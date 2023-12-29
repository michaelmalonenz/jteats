import json
import logging
from flask import (
    Flask,
    render_template,
    g,
    session,
    redirect,
    request,
    send_from_directory,
)
from flask_session import Session
from flask_dotenv import DotEnv
from flask_socketio import SocketIO
import sqlalchemy
from urllib.parse import quote_plus, urlencode
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
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SQLALCHEMY_DATABASE_URI'] = get_db_url()
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


ALLOW_ANONYMOUS = {}
def allow_anonymous(f):
    ALLOW_ANONYMOUS[f.__name__] = f
    return f


@app.route('/auth/callback')
@allow_anonymous
def callback_handling():
    # Handles response from token endpoint
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    session['jwt_payload'] = userinfo

    user = UserRepository(g.db_session).upsert_external_user(
        userinfo['sub'],
        userinfo['name'],
        userinfo['nickname'],
        userinfo['picture'],
        userinfo['email'])

    session['profile'] = {
        'user_id': user.id,
    }

    return redirect('/')


@app.route('/login')
@allow_anonymous
def login():
    return auth0.authorize_redirect(redirect_uri=f'{request.scheme}://{request.host}/auth/callback')


@app.before_request
def before_request():
    handler = app.view_functions.get(request.url_rule.endpoint, None)
    if (handler.__name__ not in ALLOW_ANONYMOUS and
        'profile' not in session):
        return redirect('/login')
    db = sqlalchemy.create_engine(get_db_url())
    g.db_session = sqlalchemy.orm.Session(db)
    g.socketio = socketio
    if 'profile' in session:
        g.current_user_id = session['profile']['user_id']


@app.teardown_request
def close_db_connection(err):
    if 'db_session' in g:
        g.db_session.close()


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(
        f'https://{AUTH0_DOMAIN}/v2/logout?' +
        urlencode(
            {
                "returnTo": f'{request.scheme}://{request.host}/login',
                "client_id": oauth_conf['clientID'],
            },
            quote_via=quote_plus,
        )
    )


@app.route('/<path:path>', methods=['GET'])
def send_static(path):
    return send_from_directory('static', path)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    socketio.run(app, debug=True)
