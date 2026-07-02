import { GitBranch, Rocket, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Deployment, Mode, Telemetry } from '@/types/deployment';

interface Props {
    deployment: Deployment;
    telemetry: Telemetry;
    mode: Mode;
    showTelemetry: boolean;
    onDeploy: () => void;
    onReset: () => void;
}

export function DeploymentCard({
    deployment,
    telemetry,
    mode,
    showTelemetry,
    onDeploy,
    onReset,
}: Props) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitBranch className="size-4" />
                    <span className="font-medium text-foreground">
                        {deployment.branch}
                    </span>
                    <span className="font-mono text-xs">
                        {deployment.commit}
                    </span>
                </div>
                <Badge
                    variant={deployment.isComplete ? 'default' : 'secondary'}
                >
                    {deployment.isComplete ? 'Live' : deployment.status}
                </Badge>
            </div>

            {/* Progress */}
            <div className="px-5 pt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{deployment.status}</span>
                    <span className="text-muted-foreground tabular-nums">
                        {deployment.progress}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500 ease-out',
                            deployment.isComplete
                                ? 'bg-emerald-500'
                                : 'bg-primary',
                        )}
                        style={{ width: `${deployment.progress}%` }}
                    />
                </div>
            </div>

            {/* Log */}
            <div className="px-5 py-5">
                <div className="space-y-1 font-mono text-xs text-muted-foreground">
                    {deployment.logs.map((log, i) => {
                        const isLast = i === deployment.logs.length - 1;

                        return (
                            <div
                                key={log.time + log.message}
                                className="flex gap-3"
                            >
                                <span className="text-muted-foreground/60">
                                    {log.time}
                                </span>
                                <span
                                    className={cn(
                                        isLast &&
                                            !deployment.isComplete &&
                                            'text-foreground',
                                    )}
                                >
                                    {log.message}
                                    {isLast && !deployment.isComplete && (
                                        <span className="ml-1 animate-pulse">
                                            …
                                        </span>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer: telemetry (only with options open) + deploy controls */}
            <div
                className={cn(
                    'flex items-center gap-4 border-t bg-muted/30 px-5 py-3',
                    showTelemetry ? 'justify-between' : 'justify-end',
                )}
            >
                {showTelemetry && (
                    <div className="flex items-center gap-5 text-xs text-muted-foreground tabular-nums">
                        <span>
                            <span className="text-foreground">
                                {telemetry.sent}
                            </span>{' '}
                            sent
                        </span>
                        <span>
                            <span className="text-foreground">
                                {telemetry.received}
                            </span>{' '}
                            received
                        </span>
                        <span className="flex items-center gap-1.5">
                            in flight
                            <InFlightDots count={telemetry.inFlight} />
                        </span>
                        {mode === 'cancel' && (
                            <span>
                                <span className="text-foreground">
                                    {telemetry.cancelled}
                                </span>{' '}
                                cancelled
                            </span>
                        )}
                    </div>
                )}

                {deployment.hasStarted ? (
                    <Button size="sm" variant="outline" onClick={onReset}>
                        <RotateCcw className="size-4" />
                        Reset
                    </Button>
                ) : (
                    <Button size="sm" onClick={onDeploy}>
                        <Rocket className="size-4" />
                        Deploy
                    </Button>
                )}
            </div>
        </div>
    );
}

function InFlightDots({ count }: { count: number }) {
    if (count === 0) {
        return <span className="size-2 rounded-full bg-muted-foreground/30" />;
    }

    return (
        <span className="flex items-center gap-1">
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="size-2 animate-pulse rounded-full bg-primary"
                />
            ))}
        </span>
    );
}
