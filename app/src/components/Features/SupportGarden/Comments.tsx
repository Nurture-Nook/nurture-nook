import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getComments } from '@/adapters/commentAdapters';
import { Comment } from './Comment';
import { CommentOut } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { insertComment, buildCommentTree } from '@/utils/comments';

export const Comments = () => {
    const router = useRouter();

    const [comments, setComments] = useState<CommentOut[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = Number(router.query.postId);

    const fetchComments = useCallback(async () => {
        try {
            const [data, error] = await getComments(postId);
            if (error) {
                setError(error);
                setComments([]);
            } else {
                setComments(data || []);
            }
        } catch (err : Error | unknown) {
            setError(err instanceof Error ? err.message : "Unable to Fetch Comments");
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (!postId) return;
        fetchComments();
    }, [postId, fetchComments]);

    const commentTree = buildCommentTree(comments);

    const handleSuccess = (newComment: CommentOut) => {
        setComments(prevComments => insertComment(prevComments, newComment));
        setLoading(false);
    };

    if (loading) return <div>Loading comments...</div>;

    if (error) {
        console.error(error);
        return <div>Error Loading Comments</div>;
    }

    console.log("c", comments)
    if (!comments) return null;

    return (
        <>
            <h3>Comments</h3>
            <CommentForm postId={postId} parentCommentId={null} onSuccess={handleSuccess} />
            <ul>
                { commentTree.map(c => (
                    <li key={c.id}>
                        <Comment postId={postId} commentId={c.id} comment={c} nesting={0} />
                    </li>
                )) }
            </ul>
        </>
    );
};
