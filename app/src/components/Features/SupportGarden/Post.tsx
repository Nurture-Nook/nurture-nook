import { useState, useEffect } from 'react';
import { getPostById } from '../../../adapters/postAdapters';

export const Post = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const [d, e] = await getPostById();

            if (e) setError(e);
            else setPost(d);

            setLoading(false);
        }

        fetchPost();
    }, [])

    if (loading) return <div>Loading post...</div>

    if (error) return <div>Error loading post.</div>

    return (
        <>
            <h3>{ post.title }</h3>
            <h5>Categories: { post.categories }</h5>
            <h4>Content Warnings: {post.contentWarnings}</h4>
            <p>{ post.content }</p>
            <ul></ul>
        </>
    )
}
