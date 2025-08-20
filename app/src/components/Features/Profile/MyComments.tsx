import { useState, useEffect } from 'react';
import { getCommentsByUser } from '../../../adapters/userAdapters';
import { CommentOut } from '@/types/comment';
import { Comment } from '../SupportGarden/Comment';

export const MyComments = () => {
    const [comments, setComments] = useState<CommentOut[] | null>(null);
    const [loading, setLoading] = useState(false);
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
            <h3>My Comments</h3>
            <ul>
                { comments.map(comment => (
                    <li key={comment.id}>
                        <Comment postId={comment.post_id} commentId={comment.id} comment={comment}/>
                    </li>
                )) }
            </ul>
        </div>
    );
};
