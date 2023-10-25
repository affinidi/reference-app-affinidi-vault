import json
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect, render, redirect
from django.urls import reverse

oauth = OAuth()

oauth.register(
    "affinidi",
    client_id=settings.PROVIDER_CLIENT_ID,
    client_secret=settings.PROVIDER_CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid offline_access',
        'token_endpoint_auth_method': 'client_secret_post',
    },
    server_metadata_url=f"{settings.PROVIDER_ISSUER}/.well-known/openid-configuration",
)

def login(request):
    redirect_uri = request.build_absolute_uri(reverse('callback'))
    return oauth.affinidi.authorize_redirect(request, redirect_uri)

def callback(request):
    token = oauth.affinidi.authorize_access_token(request)
    request.session["user"] = token['userinfo']
    return redirect(request.build_absolute_uri(reverse("index")))

def logout(request):
    request.session.pop('user', None)
    return redirect('/')

def index(request):
    user = request.session.get("user")
    if user:
        if user["custom"] and len(user["custom"][1])>0:
            email = user["custom"][1]
        else:
            email = None
    else:
        email = None
    
    if email is None:
        return render(
            request,
            "index.html",
            context={
            "session": email,
            "pretty": json.dumps(request.session.get("user"), indent=4),
            },
        )
    else:
        return render(
            request,
            "loggedin.html",
            context={
                "session": email,
                "pretty": json.dumps(request.session.get("user"), indent=4),
            },
        )