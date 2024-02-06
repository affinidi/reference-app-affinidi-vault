import json
from flask import Flask, url_for, session
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth
import urllib.parse

app = Flask(__name__)

app.config.from_object('config')
CONF_URL = app.config['PROVIDER_ISSUER'] + '/.well-known/openid-configuration'
app.secret_key = app.config['FLASK_SECRET']

oauth = OAuth(app)
oauth.register(
    name='auth0',
    client_id=app.config['PROVIDER_CLIENT_ID'],
    client_secret=app.config['PROVIDER_CLIENT_SECRET'],
    server_metadata_url= CONF_URL,
    client_kwargs={
        'scope': 'openid offline_access email profile',
        'token_endpoint_auth_method': 'client_secret_post',
    }
)

@app.route('/')
def homepage():
    user = session.get('user')
    if user:
        user = json.dumps(user,sort_keys=True, indent=4)
    return render_template('home.html', user=user)


@app.route('/login')
def login():
    redirect_uri = url_for('auth', _external=True)
    return oauth.auth0.authorize_redirect(redirect_uri)


@app.route('/auth')
def auth():
    token = oauth.auth0.authorize_access_token()
    session['user'] = token['userinfo']
    return redirect('/')


@app.route('/logout')
def logout():
    session.pop('user', None)

# If the 'client_id' parameter is included and the 'returnTo URL' is not set, the server returns the user to the first 'Allowed Logout URLs' set in the Auth0 Application Setting.

    params = {'returnTo': url_for('homepage', _external=True), 'client_id': app.config['PROVIDER_CLIENT_ID']}
    
    logout_url = f"{app.config['PROVIDER_ISSUER']}/v2/logout?{urllib.parse.urlencode(params)}"
    
    return redirect(logout_url)
    
