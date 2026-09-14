import { MainLayoutHeader, MainLayoutHeaderTitle } from '@/components/layouts/MainLayoutHeader';

// Placeholder frame for the Home map (offers-and-home PRD). The route, its gate and its place in the
// navbar are the point of this slice; the period picker, world map and ratings land on top of it.
function Home() {
    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>Home</MainLayoutHeaderTitle>
            </MainLayoutHeader>
            <p className="text-muted-foreground text-sm">The ROI map is on its way.</p>
        </>
    );
}

export { Home };
