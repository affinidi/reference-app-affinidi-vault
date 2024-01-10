<!DOCTYPE html>
<html>

<head>
    <title>Laravel</title>
</head>
<style>
    body {
        padding: 1rem;
    }
    .alert-success {
        color: #3dc58b;
        background-color: #f0fcf7;
        border-color: #d2f5e6;
    }
</style>

<body>
    <h1 class="alert-success">Congratulations, your login was successful!</h1>
    <h3>Welcome <i>{{ session("user")['email'] }}</i></h3>
    <a class="btn btn-outline-primary" href="/logout" style="width: 100%; text-decoration: none; font-weight: bold;">
        Logout
    </a>
    <p>{{ dd(session("user")) }}</p>
</body>

</html>