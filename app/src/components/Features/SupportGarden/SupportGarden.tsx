import { ExperientialCategories } from './ExperientialCategories';
import Link from 'next/link';

export const SupportGarden = () => {
    return (
        <main className="support-garden-container">
            <h2 className="page-heading">Garden of Support</h2>
            <ExperientialCategories />
            <Link href="/posts/create" passHref>
                <button type="button" className="create-post-button">Share Your Experiences</button>
            </Link>
        </main>
    );
}
