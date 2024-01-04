<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginRegisterController extends Controller
{
    private static $adapter;

    public function __construct() {
        $config = \Config::get('hybridauth');
        self::$adapter = new \App\Providers\AffinidiProvider($config);
    }

    public function login()
    {
        return view('login');
    }

    public function home()
    {
        if (session("user")) {
            return view('dashboard');
        }

        return redirect()->route('login')
            ->withErrors([
                'email' => 'Please login to access the home.',
            ]);
    }

    public function logout(Request $request)
    {   
        self::$adapter->disconnect();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login')
            ->withSuccess('You have logged out successfully!');
        ;
    }

    public function affinidiLogin(Request $request)
    {
        self::$adapter->authenticate();
    }

    public function affinidiCallback(Request $request)
    {
        try {

            self::$adapter->authenticate();

            $userProfile = self::$adapter->getUserProfile();

            session(['user' => $userProfile]);

            return redirect()->intended('home');
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->withError($e->getMessage());
        }
    }
}
