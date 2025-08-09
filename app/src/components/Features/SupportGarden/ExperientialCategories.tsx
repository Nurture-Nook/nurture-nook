import { useState, useEffect } from 'react';
import { fetchCategories } from '../../../adapters/categoryAdapters';
import { ExperientialCategory } from './ExperientialCategory';
import { CategoryWithPosts } from '../../../types/category';

export const ExperientialCategories = () => {
    const [categories, setCategories] = useState<CategoryWithPosts[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            const [d, e] = await fetchCategories();

            if (e) setError(e);
            else setCategories(d);

            setLoading(false);
        }

        getCategories();
    }, []);

    if (loading) return <div>Loading categories...</div>

    if (error) {
        console.error(error);
        return <div>Error Loading Categories</div>
    }

    if (categories === null) return;

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