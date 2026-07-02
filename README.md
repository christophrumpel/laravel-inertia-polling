# Laravel + Inertia Polling — Demo

Demo app for my YouTube video on adding **real-time updates to a Laravel +
Inertia (React) app with polling** — no WebSockets required.

📺 **Watch the video:** https://youtu.be/oFv0vR2Nus8

It builds a small deployment status dashboard and covers:

- **`usePoll`** — live updates in one line
- **`only`** — partial reloads that poll just the data that changes
- **Concurrency modes** — `overlap`, `cancel`, and `rest`

The commit history follows the video step by step — the dashboard with no
polling, then `usePoll`, then `only`, then the concurrency modes — so you can
read through it to see how each piece was added.

## Getting started

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
composer run dev
```

Then use the **"Log in as Christoph"** button on the login page and open
**Polling Modes** in the sidebar.

## Docs

- Inertia polling: https://inertiajs.com/docs/v3/data-props/polling
- Inertia: https://inertiajs.com
