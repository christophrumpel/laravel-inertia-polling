import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MODES } from '@/types/deployment';
import type { Mode } from '@/types/deployment';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    onModeChange: (mode: Mode) => void;
    keepAlive: boolean;
    onKeepAliveChange: (keepAlive: boolean) => void;
}

export function PollingOptions({
    open,
    onOpenChange,
    mode,
    onModeChange,
    keepAlive,
    onKeepAliveChange,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            <Button
                variant="ghost"
                size="sm"
                className="self-end text-muted-foreground"
                onClick={() => onOpenChange(!open)}
            >
                <SlidersHorizontal className="size-4" />
                {open ? 'Hide options' : 'Show options'}
            </Button>

            {open && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <ToggleGroup
                        type="single"
                        value={mode}
                        onValueChange={(value) =>
                            value && onModeChange(value as Mode)
                        }
                        variant="outline"
                    >
                        {MODES.map((m) => (
                            <ToggleGroupItem
                                key={m.value}
                                value={m.value}
                                className="px-4"
                            >
                                {m.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    <Toggle
                        variant="outline"
                        pressed={keepAlive}
                        onPressedChange={onKeepAliveChange}
                        className="px-4 text-muted-foreground data-[state=on]:text-foreground"
                    >
                        keepAlive
                    </Toggle>
                </div>
            )}
        </div>
    );
}
