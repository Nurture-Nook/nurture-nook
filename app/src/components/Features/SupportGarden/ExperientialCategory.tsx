import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCategoryById } from '../../../adapters/categoryAdapters';
import { CategoryWithPosts } from '@/types/category';
import { PostPreviewCard } from './PostPreviewCard';

interface CategoryProps {
    categoryId?: number;
}

export const ExperientialCategory: React.FC<CategoryProps> = ({ categoryId }) => {
    const router = useRouter();

    const [experientialCategory, setExperientialCategory] = useState<CategoryWithPosts | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const id = categoryId ?? (
        router.query.categoryId 
            ? typeof router.query.categoryId === 'string' 
                ? parseInt(router.query.categoryId) 
                : parseInt(router.query.categoryId[0])
            : undefined
    )

    useEffect(() => {
        if (!id) return;

       const fetchCategory = async () => {
            try {
                console.log("Fetching category with ID:", id);
                const [data, err] = await getCategoryById(Number(id));

                if (err) {
                    console.error("Error fetching category:", err);
                    setError(err.message || "Failed to load category");
                } else if (data) {
                    console.log("Category data:", data);
                    setExperientialCategory(data);
                } else {
                    console.error("No category data received");
                    setError("Category not found");
                }
            } catch (e) {
                console.error("Exception in fetchCategory:", e);
                setError(e instanceof Error ? e.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchCategory();
    }, [id]);

    if (loading) return <div>Loading category...</div>

    if (error) {
        console.error("Error state in component:", error);
        return <div>Error Loading Category: {error}</div>
    }

    if (!experientialCategory) {
        return <div>Category not found</div>;
    }

    return (
        <>
            <h3>{ experientialCategory.title }</h3>
            <h5>{ experientialCategory.description }</h5>
            <ul>
                {Array.isArray(experientialCategory.posts) && experientialCategory.posts.length > 0 ? 
                    experientialCategory.posts.map(postId =>
                        <li key={postId}>{ <PostPreviewCard postId={postId}/> }</li>
                    ) : 
                    <li>No posts in this category</li>
                }
            </ul>
        </>
    )
}
