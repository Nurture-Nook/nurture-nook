import { useState, useContext, useEffect } from 'react';
import { createPost } from '@/adapters/postAdapters';
import { fetchCategories } from '@/adapters/categoryAdapters';
import { fetchWarnings } from '@/adapters/warningAdapters';
import { CategoryBadge } from '@/types/category';
import { WarningBadge } from '@/types/warning';
import { CurrentUserContext } from '@/contexts/current_user_context';

export const PostForm  = () => {
    const { currentUser } = useContext(CurrentUserContext);
    const [errorText, setErrorText] = useState("");
    const [categories, setCategories] = useState<CategoryBadge[]>([]);
    const [warnings, setWarnings] = useState<WarningBadge[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoriesSelectedIds, setCategoriesSelectedIds] = useState<number[]>([]);
    const [warningsSelectedIds, setWarningsSelectedIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCategories = async () => {
            const [d, e] = await fetchCategories();

            if (e) {
                console.error("Error fetching categories:", e);
                setErrorText(e.message || "Error loading categories");
            } else if (d) {
                setCategories(d);
            } else {
                setErrorText("No categories found");
            }

            setLoading(false);
        }

        getCategories();
    }, [])

    useEffect(() => {
        const getWarnings = async () => {
            const [d, e] = await fetchWarnings();

            if (e) {
                console.error("Error fetching warnings:", e);
                setErrorText(e.message || "Error loading warnings");
            } else if (d) {
                setWarnings(d);
            } else {
                setErrorText("No warnings found");
            }

            setLoading(false);
        }

        getWarnings();
    }, [])

    if (!currentUser) return <div>Please log in to create a post</div>;
    const user_id = currentUser.id;
    
    useEffect(() => {
        console.log("Current user:", currentUser);
    }, [currentUser]);

    const handleCategoryToggle = (id: number) => {
        setCategoriesSelectedIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
    }

    const handleWarningToggle = (id: number) => {
        setWarningsSelectedIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !description || categoriesSelectedIds.length < 1) {
            setErrorText("Title, Description, and at Least One Category Are Required");
            return;
        }

        setLoading(true);
        setErrorText("");

        try {
            console.log("Creating post with:", {
                title, description, 
                categories: categoriesSelectedIds, 
                warnings: warningsSelectedIds, 
                userId: user_id
            });
            
            const [data, error] = await createPost(
                title, 
                description, 
                categoriesSelectedIds, 
                warningsSelectedIds, 
                user_id
            );
            
            if (error) {
                console.error("Error creating post:", error);
                setErrorText(`Failed to create post: ${error.message}`);
                return;
            }
            
            if (!data) {
                console.error("No data returned from post creation");
                setErrorText("Failed to create post: No response from server");
                return;
            }
            
            // Success! Reset form or redirect
            console.log("Post created successfully:", data);
            setTitle("");
            setDescription("");
            setCategoriesSelectedIds([]);
            setWarningsSelectedIds([]);
            setErrorText("Post created successfully!");
            
            // Optionally redirect to the new post or posts list
            // router.push('/garden-of-support');
        } catch (error) {
            console.error("Exception creating post:", error);
            setErrorText(error instanceof Error ? `Exception: ${error.message}` : "Unknown error occurred");
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
                <button>Post</button>
            </form>
        </>
    )
}
