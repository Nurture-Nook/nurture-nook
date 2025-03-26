import { useState, useEffect } from 'react';
import { fetchCategories } from 'categoryAdapters.ts';

export const ExperientialCategories = () => {
    const [categories, setCategories] = useState(null);
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
        return <div>Error loading categories.</div>
    }

    return (
        <>
        <ul>
            { categories.map(c => (
                <li>
                    <h3>{ c.title }</h3>
                    <ul>
                        { c.posts.map(p => <li>
                            <h5>{ p.title }</h5>
                        </li>) }
                    </ul>
                </li>
            )) }
        </ul>
        </>
    )
}
