import type { DeadlineState } from '@/lib/domain/deadline';
import type { OffersSearch } from '../schemas';

// The directory's filter and search over the cards the server already scoped (PRD stories 11, 13,
// 14). Pure, over the minimal card shape the filters read. The Deadline's state is judged by the
// caller against Kyiv's today (slice 09); the Advertiser Claim field does not exist yet (slice 07),
// so its presence arrives as a boolean and every card reads "no" until then.

export type OfferFilterSubject = {
    offerId: string;
    rawString: string;
    teamId: string | null;
    buyerUserId: string | null;
    archivedAt: string | null;
    deadline: string | null;
    deadlineState: DeadlineState;
    hasClaim: boolean;
};

const matchesDeadlineFilter = (subject: OfferFilterSubject, filter: OffersSearch['deadline']): boolean => {
    switch (filter) {
        case undefined: {
            return true;
        }
        case 'none': {
            return subject.deadline === null;
        }
        case 'any': {
            return subject.deadline !== null;
        }
        case 'due-soon':
        case 'overdue': {
            return subject.deadlineState === filter;
        }
    }
};

export const matchesOfferSearch = (subject: Pick<OfferFilterSubject, 'offerId' | 'rawString'>, query: string) => {
    const needle = query.trim().toLowerCase();

    if (needle === '') {
        return true;
    }

    return subject.offerId.toLowerCase().includes(needle) || subject.rawString.toLowerCase().includes(needle);
};

export const matchesOfferFilters = (subject: OfferFilterSubject, search: OffersSearch): boolean => {
    if ((subject.archivedAt !== null) !== search.archived) {
        return false;
    }

    if (search.team !== undefined && subject.teamId !== search.team) {
        return false;
    }

    if (search.buyer !== undefined && subject.buyerUserId !== search.buyer) {
        return false;
    }

    if (!matchesDeadlineFilter(subject, search.deadline)) {
        return false;
    }

    if (search.claim !== undefined && subject.hasClaim !== (search.claim === 'yes')) {
        return false;
    }

    return matchesOfferSearch(subject, search.q ?? '');
};

export const filterOfferCards = <T extends OfferFilterSubject>(subjects: T[], search: OffersSearch): T[] => {
    return subjects.filter((subject) => {
        return matchesOfferFilters(subject, search);
    });
};
