import json
from starlette.config import Config
from starlette.applications import Starlette
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import HTMLResponse, RedirectResponse
from starlette.templating import Jinja2Templates
from authlib.integrations.starlette_client import OAuth
import urllib.parse

config = Config('.env')
CONF_URL = config('PROVIDER_ISSUER',default='') + '/.well-known/openid-configuration'
SECRET=config('STARLETTE_SECRET',default='')

app = Starlette(debug=True)
app.add_middleware(SessionMiddleware, secret_key=SECRET)

oauth = OAuth(config)
oauth.register(
    name='auth0',
    client_id=config('PROVIDER_CLIENT_ID'),
    client_secret=config('PROVIDER_CLIENT_SECRET'),
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid offline_access email profile',
        'token_endpoint_auth_method': 'client_secret_post',
    }
)


templates = Jinja2Templates(directory='templates')

@app.route('/')
async def homepage(request):
    user = request.session.get('user')
    if user:
        user = json.dumps(user,sort_keys=True, indent=4)
    return templates.TemplateResponse("home.html", {"request": request,"user": user})


@app.route('/login')
async def login(request):
    redirect_uri = request.url_for('auth')
    return await oauth.auth0.authorize_redirect(request, redirect_uri)


@app.route('/auth')
async def auth(request):
    token = await oauth.auth0.authorize_access_token(request)
    user = token.get('userinfo')
    if user:
        request.session['user'] = user
    return RedirectResponse(url='/')


@app.route('/logout')
async def logout(request):
    request.session.pop('user', None)

# If the 'client_id' parameter is included and the 'returnTo URL' is not set, the server returns the user to the first 'Allowed Logout URLs' set in the Auth0 Application Setting.

    params = {
        'client_id': config('PROVIDER_CLIENT_ID',default=''),
        'returnTo': request.base_url.replace(path='/')
    }
    logout_url = f"{config('PROVIDER_ISSUER',default='')}/v2/logout?{urllib.parse.urlencode(params)}"
    
    return RedirectResponse(url=logout_url)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8301)
