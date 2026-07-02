import { useCallback, useState } from 'react';
import { EMPTY_TELEMETRY } from '@/types/deployment';
import type { PollEvent, Telemetry } from '@/types/deployment';

/**
 * Tracks live polling stats (requests sent, in flight, cancelled) from the
 * poller's lifecycle events. Purely for the on-screen telemetry display.
 */
export function useTelemetry() {
    const [telemetry, setTelemetry] = useState<Telemetry>(EMPTY_TELEMETRY);

    const track = useCallback((event: PollEvent) => {
        setTelemetry((t) => {
            if (event === 'start') {
                const inFlight = t.inFlight + 1;

                return {
                    ...t,
                    sent: t.sent + 1,
                    inFlight,
                    peak: Math.max(t.peak, inFlight),
                };
            }

            if (event === 'finish') {
                return { ...t, inFlight: Math.max(0, t.inFlight - 1) };
            }

            if (event === 'success') {
                return { ...t, received: t.received + 1 };
            }

            return { ...t, cancelled: t.cancelled + 1 };
        });
    }, []);

    const reset = useCallback(() => setTelemetry(EMPTY_TELEMETRY), []);

    return { telemetry, track, reset };
}
