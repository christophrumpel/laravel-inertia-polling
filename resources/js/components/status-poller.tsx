import { usePoll } from '@inertiajs/react';
import { useEffect } from 'react';
import { INTERVAL } from '@/types/deployment';
import type { Mode, PollEvent } from '@/types/deployment';

interface Props {
    mode: Mode;
    keepAlive: boolean;
    enabled: boolean;
    onEvent: (event: PollEvent) => void;
}

export function StatusPoller({ mode, keepAlive, enabled, onEvent }: Props) {
    const { start, stop } = usePoll(
        INTERVAL,
        {
            only: ['deployment'],
            onStart: () => onEvent('start'),
            onSuccess: () => onEvent('success'),
            onFinish: () => onEvent('finish'),
            onCancel: () => onEvent('cancel'),
        },
        { autoStart: false, keepAlive, mode },
    );

    useEffect(() => {
        if (enabled) {
            start();
        }

        return () => stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return null;
}
