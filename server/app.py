from functools import wraps
import json
import logging
from flask import Flask, render_template, g, session, redirect, jsonify, request
from flask_dotenv import DotEnv
from sqlalchemy import create_engine
from dbconfig import get_db_url

#from authlib.integrations.flask_client import OAuth
# from api import API_APP
# from repository import DatabaseConnector, SettingsRepository
# from repository.local import UserRepository


LOGGER = logging.getLogger(__name__)

app = Flask(__name__)
env = DotEnv()
env.init_app(app)
# app.register_blueprint(API_APP, url_prefix='/api')
# oauth = OAuth(app)

# with open('./oauth-config.json') as inf:
#     oauth_conf = json.load(inf)

# auth0 = oauth.register(
#     'auth0',
#     client_id=oauth_conf['clientID'],
#     client_secret=oauth_conf['clientSecret'],
#     api_base_url='https://{}'.format(oauth_conf['domain']),
#     access_token_url='https://{}/oauth/token'.format(oauth_conf['domain']),
#     authorize_url='https://{}/authorize'.format(oauth_conf['domain']),
#     client_kwargs={
#         'scope': 'openid profile email',
#     }
# )


# @app.route('/auth/callback')
# def callback_handling():
#     # Handles response from token endpoint
#     auth0.authorize_access_token()
#     resp = auth0.get('userinfo')
#     userinfo = resp.json()

#     # Store the user information in flask session.
#     session['jwt_payload'] = userinfo
#     session['profile'] = {
#         'user_id': userinfo['sub'],
#         'name': userinfo['name'],
#         'picture': userinfo['picture']
#     }

#     UserRepository(g.db).upsert_external_user(
#         userinfo['sub'],
#         userinfo['name'],
#         userinfo['nickname'],
#         userinfo['picture'])

#     return redirect('/')


# @app.route('/login')
# def login():
#     return auth0.authorize_redirect(redirect_uri=oauth_conf['callbackURL'])

@app.before_request
def connect_to_db():
    url = get_db_url()
    g.db = create_engine(url)
#     if 'profile' in session:
#         g.current_user = UserRepository(g.db).get_by_external_id(
#             session['profile']['user_id'])
#         g.user_settings = SettingsRepository(g.db).read_for_user(g.current_user.id)


# def requires_auth(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         if 'profile' not in session:
#             return redirect('/login')
#         return f(*args, **kwargs)

#     return decorated


@app.errorhandler(404)
def not_found_handler(e):
    print(request.access_route)
    return jsonify(error=str(e)), 404

@app.route('/', methods=['GET'])
# @requires_auth
def index():
    return render_template('index.html')


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    app.run(host="0.0.0.0", debug=True)
