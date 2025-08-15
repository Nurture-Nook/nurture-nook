import { useState, useEffect } from 'react';
import { fetchCategories } from '../../../adapters/categoryAdapters';
import { ExperientialCategory } from './ExperientialCategory';
import { CategoryWithPosts } from '../../../types/category';

export const ExperientialCategories = () => {
    const [categories, setCategories] = useState<CategoryWithPosts[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const [data, err] = await fetchCategories();
                
                if (err) {
                    console.error("Error fetching categories:", err);
                    setError(err.message || "Failed to load categories");
                } else if (Array.isArray(data)) {
                    console.log("Categories loaded:", data);
                    setCategories(data);
                } else {
                    console.error("Unexpected data format:", data);
                    setError("Received invalid data format");
                }
            } catch (e) {
                console.error("Exception in getCategories:", e);
                setError(e instanceof Error ? e.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, []);

    if (loading) return <div>Loading categories...</div>

    if (error) {
        console.error("Error state in component:", error);
        return <div>Error Loading Categories: {error}</div>
    }

    if (!categories || categories.length === 0) {
        return <div>No categories found</div>;
    }

    return (
        <>
        <ul>
            { categories.map(c => (
                <li key={c.id}>
                    { <ExperientialCategory categoryId={c.id} />}
                </li>
            )) }
        </ul>
        </>
    )
}