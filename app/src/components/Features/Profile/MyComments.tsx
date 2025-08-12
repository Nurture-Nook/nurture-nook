import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCommentsByUser } from '../../../adapters/userAdapters';
import { CommentOut } from '@/types/comment';
import { Comment } from '../SupportGarden/Comment';

export const MyComments = () => {
    const [comments, setComments] = useState<CommentOut[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            const [data, err] = await getCommentsByUser();
            if (err) setError(err);
            else setComments(data);

            setLoading(false);
        };

        fetchComments();
    }, []);

    if (loading) return <div>Loading your comments...</div>;
    if (error) return <div>Error loading comments: {error}</div>;
    if (!comments || comments.length === 0) return <div>No Comments Found</div>;

    return (
        <div>
            <Link href="me/comments"><h3>My Posts</h3></Link>
            <ul>
                { comments.map(comment => (
                    <li key={comment.id}>
                        <Comment postId={comment.post_id} commentId={comment.id}/>
                    </li>
                )) }
            </ul>
        </div>
    );
};
