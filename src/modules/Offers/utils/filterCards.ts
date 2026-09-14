import type { OffersSearch } from '../schemas';

// The directory's filter and search over the cards the server already scoped (PRD stories 11, 13,
// 14). Pure, over the minimal card shape the filters read — the deadline and Advertiser Claim
// fields do not exist yet (slices 09 and 07), so the caller supplies their presence as booleans and
// every card reads "none"/"no" until then.

export type OfferFilterSubject = {
    offerId: string;
    rawString: string;
    teamId: string | null;
    buyerUserId: string | null;
    archivedAt: string | null;
    hasDeadline: boolean;
    hasClaim: boolean;
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

    if (search.deadline !== undefined && subject.hasDeadline !== (search.deadline === 'any')) {
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
