import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    reset,
    restart,
} from '@/actions/App/Http/Controllers/DeploymentController';
import { DeploymentCard } from '@/components/deployment-card';
import { PollingOptions } from '@/components/polling-options';
import { useTelemetry } from '@/hooks/use-telemetry';
import { polling } from '@/routes';
import type { Deployment, Mode } from '@/types/deployment';

export default function PollingModes({
    deployment,
}: {
    deployment: Deployment;
}) {
    const [mode, setMode] = useState<Mode>('overlap');
    const [keepAlive, setKeepAlive] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { telemetry, reset: resetTelemetry } = useTelemetry();

    const changeMode = (value: Mode) => {
        setMode(value);
        resetTelemetry();
    };

    const startDeploy = () => {
        resetTelemetry();
        router.post(restart().url, {}, { preserveScroll: true });
    };

    const resetDeploy = () => {
        resetTelemetry();
        router.post(reset().url, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Polling Modes" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
                <PollingOptions
                    open={showOptions}
                    onOpenChange={setShowOptions}
                    mode={mode}
                    onModeChange={changeMode}
                    keepAlive={keepAlive}
                    onKeepAliveChange={setKeepAlive}
                />

                <DeploymentCard
                    deployment={deployment}
                    telemetry={telemetry}
                    mode={mode}
                    showTelemetry={showOptions}
                    onDeploy={startDeploy}
                    onReset={resetDeploy}
                />
            </div>
        </>
    );
}

PollingModes.layout = {
    breadcrumbs: [
        {
            title: 'Polling Modes',
            href: polling(),
        },
    ],
};
