<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DeploymentController extends Controller
{
    /**
     * The ordered stages a deployment moves through. The final stage ("Live")
     * marks completion and is not counted as working time.
     *
     * @var list<string>
     */
    private const STAGES = [
        'Queued',
        'Cloning repository',
        'Installing dependencies',
        'Compiling assets',
        'Running migrations',
        'Restarting workers',
        'Live',
    ];

    private const SECONDS_PER_STAGE = 3;

    public function show(Request $request): Response
    {
        // Simulate a variable-latency backend, but only for polling (partial)
        // requests so the initial page load stays instant. Latency lands
        // either comfortably under the 1s poll interval or clearly over it —
        // so in "cancel" mode you see some responses come through and slower
        // ones get aborted when the next tick fires.
        if ($request->header('X-Inertia-Partial-Data')) {
            $latencyMs = random_int(0, 1) === 0
                ? random_int(300, 800)     // fast: finishes within the interval
                : random_int(1400, 2600);  // slow: overruns the interval

            usleep($latencyMs * 1000);
        }

        return Inertia::render('polling-modes', [
            'deployment' => fn (): array => $this->currentDeployment($request),
        ]);
    }

    public function restart(Request $request): RedirectResponse
    {
        Cache::put($this->cacheKey($request), now()->timestamp, now()->addHour());

        return back();
    }

    public function reset(Request $request): RedirectResponse
    {
        Cache::forget($this->cacheKey($request));

        return back();
    }

    /**
     * @return array{branch: string, commit: string, status: string, progress: int, hasStarted: bool, isComplete: bool, logs: list<array{time: string, message: string}>, serverTime: string}
     */
    private function currentDeployment(Request $request): array
    {
        $startedAt = Cache::get($this->cacheKey($request));

        // No deployment has been kicked off yet: sit idle until the user
        // clicks "Deploy". Polling stays off while we're in this state.
        if ($startedAt === null) {
            return [
                'branch' => 'main',
                'commit' => '9f3c2a1',
                'status' => 'Idle',
                'progress' => 0,
                'hasStarted' => false,
                'isComplete' => false,
                'logs' => [],
                'serverTime' => now()->format('H:i:s'),
            ];
        }

        $workingStages = count(self::STAGES) - 1;
        $totalSeconds = $workingStages * self::SECONDS_PER_STAGE;
        $elapsed = max(0, now()->timestamp - $startedAt);

        $stageIndex = min($workingStages, intdiv($elapsed, self::SECONDS_PER_STAGE));
        $progress = (int) min(100, round($elapsed / $totalSeconds * 100));
        $isComplete = $elapsed >= $totalSeconds;

        return [
            'branch' => 'main',
            'commit' => '9f3c2a1',
            'status' => self::STAGES[$stageIndex],
            'progress' => $progress,
            'hasStarted' => true,
            'isComplete' => $isComplete,
            'logs' => $this->logs($startedAt, $stageIndex),
            'serverTime' => now()->format('H:i:s'),
        ];
    }

    /**
     * @return list<array{time: string, message: string}>
     */
    private function logs(int $startedAt, int $stageIndex): array
    {
        $logs = [];

        for ($i = 0; $i <= $stageIndex; $i++) {
            $logs[] = [
                'time' => Carbon::createFromTimestamp($startedAt + $i * self::SECONDS_PER_STAGE)->format('H:i:s'),
                'message' => self::STAGES[$i],
            ];
        }

        return $logs;
    }

    private function cacheKey(Request $request): string
    {
        return 'deployment:'.$request->user()->id;
    }
}
