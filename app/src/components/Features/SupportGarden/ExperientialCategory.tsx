import { useState } from 'react';
import { getCategoryByName } from '../../../../adapters/categoryAdapters.ts';

export const ExperientialCategory = () => {
    const [experientialCategory, setExperientialCategory] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       const fetchCategory = async () => {
            const [d, e] = await getCategoryByName();

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

    return (
        <>
        <h3>{ experientialCategory.name }</h3>
        <h5>{ experientialCategory.description }</h5>
        <ul>
            { experientialCategory.posts.map(c => <li>{ c }</li>) }
        </ul>
        </>
    )
}
