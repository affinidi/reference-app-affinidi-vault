import json
from flask import Flask, url_for, session
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = '!secret'
app.config.from_object('config')
CONF_URL = app.config['PROVIDER_ISSUER'] + '/.well-known/openid-configuration'

oauth = OAuth(app)
oauth.register(
    name='affinidi',
    client_id=app.config['PROVIDER_CLIENT_ID'],
    client_secret=app.config['PROVIDER_CLIENT_SECRET'],
    server_metadata_url= CONF_URL,
    client_kwargs={
        'scope': 'openid offline_access',
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
    return oauth.affinidi.authorize_redirect(redirect_uri)


@app.route('/auth')
def auth():
    token = oauth.affinidi.authorize_access_token()
    session['user'] = token['userinfo']
    return redirect('/')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')
