export type Mode = 'overlap' | 'cancel' | 'rest';

export type PollEvent = 'start' | 'finish' | 'cancel' | 'success';

export interface Deployment {
    branch: string;
    commit: string;
    status: string;
    progress: number;
    hasStarted: boolean;
    isComplete: boolean;
    logs: { time: string; message: string }[];
    serverTime: string;
}

export interface Telemetry {
    sent: number;
    received: number;
    inFlight: number;
    cancelled: number;
    peak: number;
}

export const INTERVAL = 1000;

export const EMPTY_TELEMETRY: Telemetry = {
    sent: 0,
    received: 0,
    inFlight: 0,
    cancelled: 0,
    peak: 0,
};

export const MODES: { value: Mode; label: string }[] = [
    { value: 'overlap', label: 'Overlap' },
    { value: 'cancel', label: 'Cancel' },
    { value: 'rest', label: 'Rest' },
];
