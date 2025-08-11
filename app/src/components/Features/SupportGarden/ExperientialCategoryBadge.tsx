import { useState, useEffect } from 'react';
import { CategoryBadge } from '@/types/category';
import { getCategoryById } from '@/adapters/categoryAdapters';

interface CategoryBadgeProps {
    categoryId: number;
}

export const ExperientialCategoryBadge: React.FC<CategoryBadgeProps> = ({ categoryId }) => {
    const [experientialCategory, setExperientialCategory] = useState<CategoryBadge | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

       const fetchCategory = async () => {
            const [d, e] = await getCategoryById(Number(categoryId));

            if (e) setError(e);
            else setExperientialCategory(d);

            setLoading(false);
        }

        fetchCategory();
    }, [categoryId])

    if (loading) return <div>Loading category name...</div>

    if (error) {
        console.error(error);
        return <div>Error Loading Category Name</div>
    }

    if (experientialCategory === null) return;

    return <p>{ experientialCategory.title }</p>
}