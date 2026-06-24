<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        Vite::prefetch(concurrency: 3);

        // Track user login
        Event::listen(Login::class, function (Login $event) {
            if ($event->user instanceof User) {
                $event->user->update([
                    'last_login_at' => now(),
                    'last_login_ip' => request()->ip(),
                    'login_count' => $event->user->login_count + 1,
                ]);
            }
        });

        // Track user logout
        Event::listen(Logout::class, function (Logout $event) {
            if ($event->user instanceof User) {
                $event->user->update([
                    'last_logout_at' => now(),
                ]);
            }
        });
    }
}
