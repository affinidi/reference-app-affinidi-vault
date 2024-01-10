<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Contracts\Factory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $socialite = $this->app->make(Factory::class);

        //Setup affinidi driver
        \Affinidi\SocialiteProvider\AffinidiSocialite::extend($socialite);
    }
}
