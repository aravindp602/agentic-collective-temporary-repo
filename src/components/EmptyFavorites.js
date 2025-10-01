import Link from 'next/link';

export default function EmptyFavorites() {
    return (
        <div className="empty-favorites-container">
            {/* You can find great, free SVG illustrations at undraw.co */}
            <img src="/img/empty-state-illustration.svg" alt="A robot looking at stars" className="empty-state-illustration" />
            <h2>Your workspace is ready</h2>
            <p>Your favorite agents will shine here. Explore the collective to get started.</p>
            <Link href="/" className="cta-button">
                Explore Agents Now
            </Link>
        </div>
    );
}