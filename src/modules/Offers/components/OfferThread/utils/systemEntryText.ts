import type { OfferThreadEntryView } from '@/services/offers/types';

// What a system entry says (offers-and-home/08, 09): the change and its new value, with the actor
// appended by the renderer. `body` holds the value as text — a cleared Deadline is an empty body.
export const systemEntryText = (entry: Pick<OfferThreadEntryView, 'kind' | 'body'>): string => {
    switch (entry.kind) {
        case 'deadline_changed': {
            return entry.body === '' ? 'Deadline cleared' : `Deadline moved to ${entry.body}`;
        }
        case 'assignment_changed': {
            return `Assigned to ${entry.body}`;
        }
        case 'comment': {
            return entry.body;
        }
    }
};
