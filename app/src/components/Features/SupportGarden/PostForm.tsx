import { useState, useContext, useEffect } from 'react';
import { createPost } from '@/adapters/postAdapters';
import { fetchCategories } from '@/adapters/categoryAdapters';
import { fetchWarnings } from '@/adapters/warningAdapters';
import { PostCreate } from '@/types/post';
import { CategoryBadge } from '@/types/category';
import { WarningBadge } from '@/types/warning';
import { CurrentUserContext } from '@/contexts/current_user_context';

export const PostForm: React.FC<PostCreate> = () => {
    const { currentUser } = useContext(CurrentUserContext);
    const [errorText, setErrorText] = useState("");
    const [categories, setCategories] = useState<CategoryBadge[]>([]);
    const [warnings, setWarnings] = useState<WarningBadge[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoriesSelectedIds, setCategoriesSelectedIds] = useState<number[]>([]);
    const [warningsSelectedIds, setWarningsSelectedIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);

    if (!currentUser) return;
    const user_id = currentUser.id;

    useEffect(() => {
        const getCategories = async () => {
            const [d, e] = await fetchCategories();

            if (e) setErrorText(e);
            else setCategories(d);

            setLoading(false);
        }

        getCategories();
    }, [])

    useEffect(() => {
        const getWarnings = async () => {
            const [d, e] = await fetchWarnings();

            if (e) setErrorText(e);
            else setWarnings(d);

            setLoading(false);
        }

        getWarnings();
    }, [])

    const handleCategoryToggle = (id: number) => {
        setCategoriesSelectedIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
    }

    const handleWarningToggle = (id: number) => {
        setWarningsSelectedIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !description || categoriesSelectedIds.length < 1) return setErrorText("Title, Description, and at Least One Category Are Required");

        setLoading(true);

        try {
            await createPost(title, description, categoriesSelectedIds, warningsSelectedIds, user_id);
        } catch (error) {
            setErrorText("Failed to Create Post");
            console.error("Failed to create post: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <p>{errorText}</p>
            
            <form onSubmit={handleSubmit} className="post-form">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="title your post..."
                    disabled={loading}
                    className='input-field'
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="write a description..."
                    disabled={loading}
                    className='input-field'
                />
                <h4>Select Categories</h4>
                {categories.map(c => (
                    <label key={c.id}>
                        <input
                            type="checkbox"
                            checked={categoriesSelectedIds.includes(c.id)}
                            onChange={() => handleCategoryToggle(c.id)}
                        />
                        { c.title }
                    </label>
                ))}
                <h4>Select Content Warnings</h4>
                {warnings.map(w => (
                    <label key={w.id}>
                        <input
                            type="checkbox"
                            checked={warningsSelectedIds.includes(w.id)}
                            onChange={() => handleWarningToggle(w.id)}
                        />
                        { w.title }
                    </label>
                ))}
            </form>
        </>
    )
}
