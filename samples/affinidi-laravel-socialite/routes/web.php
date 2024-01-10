<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginRegisterController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('login');
});

Route::controller(LoginRegisterController::class)->group(function() {
    Route::get('/login', 'login')->name('login');
    Route::get('/home', 'home')->name('home');
    Route::get('/logout', 'logout')->name('logout');
    Route::get('/login/affinidi', 'affinidiLogin')->name('affinidi-login');
    Route::get('/login/affinidi/callback', 'affinidiCallback')->name('affinidi-callback');
});