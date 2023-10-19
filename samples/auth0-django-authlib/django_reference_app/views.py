import json
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect, render, redirect
from django.urls import reverse
from urllib.parse import quote_plus, urlencode

oauth = OAuth()

oauth.register(
    "auth0",
    client_id=settings.PROVIDER_CLIENT_ID,
    client_secret=settings.PROVIDER_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"{settings.PROVIDER_ISSUER}/.well-known/openid-configuration",
)

def login(request):
    return oauth.auth0.authorize_redirect(
        request, request.build_absolute_uri(reverse("callback"))
    )

def callback(request):
    token = oauth.auth0.authorize_access_token(request)
    request.session["user"] = token
    return redirect(request.build_absolute_uri(reverse("index")))

def logout(request):
    request.session.clear()

    return redirect(
        f"{settings.PROVIDER_ISSUER}/v2/logout?"
        + urlencode(
            {
                "returnTo": request.build_absolute_uri(reverse("index")),
                "client_id": settings.PROVIDER_CLIENT_ID,
            },
            quote_via=quote_plus,
        ),
    )

def index(request):
    user = request.session.get("user")

    if user is None:
        return render(
            request,
            "index.html",
            context={
                "session": request.session.get("user"),
                "pretty": json.dumps(request.session.get("user"), indent=4),
            },
        )
    else:
        return render(
            request,
            "loggedin.html",
            context={
                "session": request.session.get("user"),
                "pretty": json.dumps(request.session.get("user"), indent=4),
            },
        )