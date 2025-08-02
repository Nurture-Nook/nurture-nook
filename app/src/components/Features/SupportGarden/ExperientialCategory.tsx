import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCategoryById } from '../../../adapters/categoryAdapters';
import { getPostPreviewById } from '@/adapters/postAdapters';
import { CategoryWithPosts } from '@/types/category';

interface CategoryProps {
    categoryId?: number;
}

export const ExperientialCategory: React.FC<CategoryProps> = ({ categoryId }) => {
    const router = useRouter();

    const [experientialCategory, setExperientialCategory] = useState<CategoryWithPosts | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const queryId = router.query;
    const id = categoryId ?? (typeof queryId === 'string' ? parseInt(queryId) : undefined)

    useEffect(() => {
        if (!id) return;

       const fetchCategory = async () => {
            const [d, e] = await getCategoryById(Number(id));

            if (e) setError(e);
            else setExperientialCategory(d);

            setLoading(false);
        }

        fetchCategory();
    }, []);

    if (loading) return <div>Loading category...</div>

    if (error) {
        console.error(error);
        return <div>Error loading category.</div>
    }

    if (experientialCategory === null) return;

    return (
        <>
            <h3>{ experientialCategory.title }</h3>
            <h5>{ experientialCategory.description }</h5>
            <ul>
                { experientialCategory.posts.map(postId => <li>{ getPostPreviewById(postId) }</li>) }
            </ul>
        </>
    )
}
