import json
from dotenv import dotenv_values
from fastapi import FastAPI
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi.templating import Jinja2Templates
import urllib.parse


app = FastAPI()
config = Config('.env')
oauth = OAuth(config)

config_env = {
    **dotenv_values(".env"),  # load local file development variables
}
SECRET=config_env['FASTAPI_SECRET']

app.add_middleware(SessionMiddleware, secret_key=SECRET)


CONF_URL = config_env['PROVIDER_ISSUER'] + '/.well-known/openid-configuration'
oauth.register(
    name='auth0',
    client_id=config_env['PROVIDER_CLIENT_ID'],
    client_secret=config_env['PROVIDER_CLIENT_SECRET'],
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid offline_access email profile',
        'token_endpoint_auth_method': 'client_secret_post',
    }
)

# Html templates
templates = Jinja2Templates(directory="templates")

@app.get('/')
async def homepage(request: Request):
    user = request.session.get('user')
    if user:
        user = json.dumps(user,sort_keys=True, indent=4)
    return templates.TemplateResponse("home.html", {"request": request,"user": user})


@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.auth0.authorize_redirect(request, redirect_uri)


@app.get('/auth')
async def auth(request: Request):
    try:
        token = await oauth.auth0.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url='/')


@app.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)

# If the 'client_id' parameter is included and the 'returnTo URL' is not set, the server returns the user to the first 'Allowed Logout URLs' set in the Auth0 Application Setting.

    params = {
        'client_id': config_env['PROVIDER_CLIENT_ID'],
        'returnTo': request.base_url.replace(path='/')
    }
    logout_url = f"{config_env['PROVIDER_ISSUER']}/v2/logout?{urllib.parse.urlencode(params)}"
    
    return RedirectResponse(url=logout_url)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8201)
