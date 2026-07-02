<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $this->get(route('polling'))->assertRedirect(route('login'));
});

test('the polling page starts idle until a deployment is triggered', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('polling'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('polling-modes')
            ->where('deployment.branch', 'main')
            ->where('deployment.progress', 0)
            ->where('deployment.status', 'Idle')
            ->where('deployment.hasStarted', false)
            ->where('deployment.isComplete', false)
            ->has('deployment.logs', 0)
        );
});

test('triggering a deploy starts the deployment', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('polling.restart'))->assertRedirect();

    $this->get(route('polling'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('deployment.hasStarted', true)
            ->where('deployment.status', 'Queued')
            ->where('deployment.progress', 0)
            ->where('deployment.isComplete', false)
            ->has('deployment.logs', 1)
        );
});

test('resetting returns the deployment to idle', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('polling.restart'));
    $this->post(route('polling.reset'))->assertRedirect();

    $this->get(route('polling'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('deployment.hasStarted', false)
            ->where('deployment.status', 'Idle')
        );
});

test('a deployment reports completion once enough time has elapsed', function () {
    $this->actingAs(User::factory()->create());

    $this->travelTo(now());
    $this->post(route('polling.restart')); // Starts the deployment "now".

    $this->travel(30)->seconds();

    $this->get(route('polling'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('deployment.progress', 100)
            ->where('deployment.status', 'Live')
            ->where('deployment.isComplete', true)
        );
});
