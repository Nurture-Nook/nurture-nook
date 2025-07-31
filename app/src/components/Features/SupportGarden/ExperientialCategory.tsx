import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCategoryById } from '../../../adapters/categoryAdapters';
import { getPostPreviewById } from '@/adapters/postAdapters';
import { CategoryWithPosts } from '@/types/category';

export const ExperientialCategory = () => {
    const router = useRouter();

    const [experientialCategory, setExperientialCategory] = useState<CategoryWithPosts | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const categoryId = router.query;

    useEffect(() => {
        if (!categoryId) return;

       const fetchCategory = async () => {
            const [d, e] = await getCategoryById(Number(categoryId));

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
