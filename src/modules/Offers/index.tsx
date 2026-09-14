import { MainLayoutHeader, MainLayoutHeaderTitle } from '@/components/layouts/MainLayoutHeader';

// Placeholder frame for Offers (offers-and-home PRD). The route, its gate and its place in the
// navbar are the point of this slice; the card list, search and claim editor land on top of it.
function Offers() {
    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>Offers</MainLayoutHeaderTitle>
            </MainLayoutHeader>
            <p className="text-muted-foreground text-sm">Offer cards are on their way.</p>
        </>
    );
}

export { Offers };
