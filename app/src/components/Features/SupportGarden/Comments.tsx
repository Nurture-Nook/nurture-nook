import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getComments } from '@/adapters/commentAdapters';
import { Comment } from './Comment';
import { CommentOut } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';

export const Comments = () => {
    const router = useRouter();

    const [comments, setComments] = useState<CommentOut[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = Number(router.query.postId);

    const fetchComments = useCallback(async () => {
        try {
            const res = await getComments(postId);
            setComments(res);
        } catch (err : Error | unknown) {
            setError(error);
            if (err instanceof Error) console.error(err.message);
            else console.error("Unable to Fetch Comments")
        }
    }, [postId, error]);

    useEffect(() => {
        if (!postId) return;
        fetchComments();
    }, [postId, fetchComments]);

    const handleSuccess = (newComment: CommentOut) => {
        setComments(prevComments => insertComment(prevComments, newComment));
        setLoading(false);
    };

    if (loading) return <div>Loading comments...</div>;

    if (error) {
        console.error(error);
        return <div>Error Loading Comments</div>;
    }

    if (!comments) return null;

    return (
        <>
            <h3>Comments</h3>
            <CommentForm postId={postId} parentCommentId={null} onSuccess={handleSuccess} />
            <ul>
                { comments.map(c => (
                    <li key={c.id}>
                        <Comment postId={postId} commentId={c.id} />
                    </li>
                )) }
            </ul>
        </>
    );
};
