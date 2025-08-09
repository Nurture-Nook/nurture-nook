import { useState, useEffect } from 'react';
import { Router, useRouter } from 'next/router';
import { getComments } from '@/adapters/commentAdapters';
import { Comment } from './Comment';
import { CommentOut } from '@/types/comment';

export const Comments = () => {
    const router = useRouter();

    const [comments, setComments] = useState<CommentOut[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = router.query;

    useEffect(() => {
            const fetchComments = async () => {
                const [d, e] = await getComments(Number(postId));
    
                if (e) setError(e);
                else setComments(d);
    
                setLoading(false);
            }
    
            fetchComments();
    }, []);

    if (loading) return <div>Loading comments...</div>

    if (error) {
        console.error(error);
        return <div>Error Loading Comments</div>
    }

    if (comments === null) return;

    return (
        <>
        <ul>
            { comments.map(c => (
                <li key={c.id}>
                    { <Comment postId={Number(postId)} commentId={c.id} />}
                </li>
            )) }
        </ul>
        </>
    )
}
