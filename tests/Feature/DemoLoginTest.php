<?php

use App\Models\User;

test('the demo login button logs in the seeded user', function () {
    $this->post(route('demo-login'))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    expect(auth()->user())
        ->email->toBe('christoph@laravel.com')
        ->name->toBe('Christoph');
});

test('the demo login creates the user if it does not exist yet', function () {
    expect(User::query()->where('email', 'christoph@laravel.com')->exists())->toBeFalse();

    $this->post(route('demo-login'));

    $this->assertAuthenticated();
    expect(User::query()->where('email', 'christoph@laravel.com')->exists())->toBeTrue();
});
