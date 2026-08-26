import type { FrameTeam } from '@/modules/Dynamics/utils/frame';
import { cn } from '@/lib/utils/cn';

// The frame's first level (SPEC §6.1). Identical for every role — only which teams arrive changes,
// and that is decided by row-scope on the server (ADR-0007), never here. A buyer sees one team and
// still sees the level: the frame never changes shape between roles.
//
// There is no team aggregate anywhere (SPEC I7): a team is a heading over its buyers, not a number.

type TeamTabsProps = {
    teams: FrameTeam[];
    activeId: string | null;
    onSelect: (teamId: string | null) => void;
};

function TeamTabs({ teams, activeId, onSelect }: TeamTabsProps) {
    return (
        <div role="tablist" aria-label="Team" className="flex flex-wrap gap-2">
            {teams.map((team) => {
                const selected = team.id === activeId;

                return (
                    <button
                        // A teamless row has no id; its label is the only key it can have, and the
                        // list holds at most one of it.
                        key={team.id ?? team.name}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={cn(
                            'rounded-md border px-3 py-1.5 text-xs font-medium motion-safe:transition-colors motion-safe:duration-150',
                            selected
                                ? 'border-accent bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:text-foreground border-border bg-surface'
                        )}
                        onClick={() => {
                            onSelect(team.id);
                        }}
                    >
                        {team.name}
                    </button>
                );
            })}
        </div>
    );
}

export { TeamTabs };
