import type { OfferThreadEntryView } from '@/services/offers/types';
import type { OfferThreadProps } from './types';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HistoryIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { ROLES_CONFIG } from '@/lib/utils/auth/permissions';
import { cn } from '@/lib/utils/cn';
import {
    addOfferCommentMutationOptions,
    deleteOfferCommentMutationOptions,
    editOfferCommentMutationOptions,
    markOfferCardSeenMutationOptions,
    offerThreadQueryOptions,
} from '@/services/offers/queries';
import { OFFER_COMMENT_MAX_LENGTH } from '@/services/offers/schemas';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Textarea } from '@/components/ui/Textarea';
import { systemEntryText } from './utils/systemEntryText';

const stampFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

type CommentComposerProps = {
    value: string;
    onChange: (value: string) => void;
    // What the box held before editing began; an unchanged edit has nothing to save.
    initialBody?: string;
    submitLabel: string;
    isPending: boolean;
    onSubmit: (body: string) => void;
    onCancel?: () => void;
};

// Controlled, so the owner decides when the draft clears (after a successful post) — a refetch of
// the Thread must never wipe half-written words.
function CommentComposer({
    value,
    onChange,
    initialBody = '',
    submitLabel,
    isPending,
    onSubmit,
    onCancel,
}: CommentComposerProps) {
    const trimmed = value.trim();
    const canSubmit = trimmed !== '' && trimmed.length <= OFFER_COMMENT_MAX_LENGTH && trimmed !== initialBody;

    return (
        <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();

                if (canSubmit) {
                    onSubmit(trimmed);
                }
            }}
        >
            <Textarea
                aria-label="Comment"
                placeholder="Write a comment"
                value={value}
                maxLength={OFFER_COMMENT_MAX_LENGTH}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                onKeyDown={(e) => {
                    // Cmd/Ctrl+Enter posts, like every chat the team already uses.
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
                        e.preventDefault();
                        onSubmit(trimmed);
                    }
                }}
            />
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" size="xs" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size="xs" disabled={!canSubmit} isLoading={isPending}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

type ThreadEntryProps = {
    entry: OfferThreadEntryView;
    offerCardId: string;
    isArchived: boolean;
};

function ThreadEntry({ entry, offerCardId, isArchived }: ThreadEntryProps) {
    // Null while not editing; the draft while editing.
    const [draft, setDraft] = useState<string | null>(null);
    const { mutate: editComment, isPending: isEditPending } = useMutation(editOfferCommentMutationOptions(offerCardId));
    const { mutate: deleteComment, isPending: isDeletePending } = useMutation(
        deleteOfferCommentMutationOptions(offerCardId)
    );
    const author = entry.authorNickname ?? 'Deleted user';
    const stamp = (
        <time dateTime={entry.createdAt} className="text-muted-foreground text-xs">
            {stampFormat.format(new Date(entry.createdAt))}
        </time>
    );

    // System entries (slice 09) read as one muted line: the change, its value, who did it, when.
    if (entry.kind !== 'comment') {
        return (
            <li className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                <HistoryIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>
                    {systemEntryText(entry)} · {author}
                </span>
                {stamp}
            </li>
        );
    }

    function handleEdit(body: string) {
        editComment(
            { entryId: entry.id, body },
            {
                onSuccess() {
                    setDraft(null);
                },
                onError() {
                    toast.error('Failed to edit the comment — the 15-minute window may have closed');
                },
            }
        );
    }

    function handleDelete() {
        deleteComment(
            { entryId: entry.id },
            {
                onError() {
                    toast.error('Failed to delete the comment — the 15-minute window may have closed');
                },
            }
        );
    }

    return (
        <li className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-sm font-medium">{author}</span>
                {entry.authorRole && (
                    <span className="text-muted-foreground text-xs tracking-wide uppercase">
                        {ROLES_CONFIG[entry.authorRole].label}
                    </span>
                )}
                {stamp}
                {entry.editedAt !== null && entry.deletedAt === null && (
                    <span className="text-muted-foreground text-xs">(edited)</span>
                )}
                {entry.canEdit && !isArchived && draft === null && (
                    <span className="ml-auto flex gap-1">
                        <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label="Edit comment"
                            onClick={() => {
                                setDraft(entry.body);
                            }}
                        >
                            <PencilIcon />
                        </Button>
                        <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label="Delete comment"
                            isLoading={isDeletePending}
                            onClick={handleDelete}
                        >
                            <Trash2Icon />
                        </Button>
                    </span>
                )}
            </div>
            {draft !== null ? (
                <CommentComposer
                    value={draft}
                    onChange={setDraft}
                    initialBody={entry.body}
                    submitLabel="Save"
                    isPending={isEditPending}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setDraft(null);
                    }}
                />
            ) : (
                <p
                    className={cn(
                        'text-sm break-words whitespace-pre-wrap',
                        entry.deletedAt !== null && 'text-muted-foreground italic'
                    )}
                >
                    {entry.deletedAt !== null ? 'Comment deleted' : entry.body}
                </p>
            )}
        </li>
    );
}

// A card's Thread in a sheet (offers-and-home/08, PRD stories 30–34): comments and system entries
// in one order, newest at the bottom. Opening it marks the card seen, which is what the list's
// unread counter reads from. Anyone who can read the card reads the Thread; posting needs the
// role's `comment` capability and a live card — an archived card's Thread is history only.
function OfferThread({ card, open, onOpenChange, canComment }: OfferThreadProps) {
    const isArchived = card.archivedAt !== null;
    // `useQuery`, not suspense: the sheet must not tear down while the Thread loads or refetches.
    const { data: entries, isPending } = useQuery({ ...offerThreadQueryOptions(card.id), enabled: open });
    const { mutate: addComment, isPending: isAdding } = useMutation(addOfferCommentMutationOptions());
    const [draft, setDraft] = useState('');
    const { mutate: markSeen } = useMutation(markOfferCardSeenMutationOptions());

    useEffect(
        function markSeenOnOpen() {
            // The seen mark is an external record, written once per opening (PRD story 34).
            if (open) {
                markSeen({ offerCardId: card.id });
            }
        },
        [open, card.id, markSeen]
    );

    function handleAdd(body: string) {
        addComment(
            { offerCardId: card.id, body },
            {
                onSuccess() {
                    setDraft('');
                },
                onError() {
                    toast.error('Failed to post the comment');
                },
            }
        );
    }

    function renderEntries() {
        if (isPending || !entries) {
            return (
                <div className="flex justify-center py-6">
                    <Loader />
                </div>
            );
        }

        if (entries.length === 0) {
            return <p className="text-muted-foreground text-sm">Nothing here yet.</p>;
        }

        return (
            <ol className="flex flex-col gap-4">
                {entries.map((entry) => {
                    return <ThreadEntry key={entry.id} entry={entry} offerCardId={card.id} isArchived={isArchived} />;
                })}
            </ol>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="gap-0">
                <SheetHeader>
                    <SheetTitle>Thread · #{card.offerId}</SheetTitle>
                    <SheetDescription>
                        {isArchived
                            ? 'This card is archived — the thread is readable but closed to new comments.'
                            : 'Comments and changes, oldest first. Your own comment can be edited or deleted for 15 minutes.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">{renderEntries()}</div>

                {canComment && !isArchived && (
                    <div className="border-t p-4">
                        <CommentComposer
                            value={draft}
                            onChange={setDraft}
                            submitLabel="Post"
                            isPending={isAdding}
                            onSubmit={handleAdd}
                        />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

export { OfferThread };
