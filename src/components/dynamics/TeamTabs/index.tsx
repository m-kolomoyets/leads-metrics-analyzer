import type { FrameTeam } from '@/modules/Dynamics/utils/frame';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

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
        <Segmented label="Team">
            {teams.map((team) => {
                return (
                    <SegmentedItem
                        // A teamless row has no id; its label is the only key it can have, and the
                        // list holds at most one of it.
                        key={team.id ?? team.name}
                        selected={team.id === activeId}
                        className="text-xs"
                        onSelect={() => {
                            onSelect(team.id);
                        }}
                    >
                        {team.name}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { TeamTabs };
