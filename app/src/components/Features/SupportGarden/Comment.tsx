import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { CommentOut } from '../../../types/comment';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getCommentById, deleteCommentById } from '../../../adapters/commentAdapters';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';
import { CurrentUserContext } from '@/contexts/current_user_context';

interface CommentProps {
    postId: number;
    commentId: number;
}

export const Comment: React.FC<CommentProps> = ({ postId, commentId }) => {
    const { currentUser } = useContext(CurrentUserContext);
    const [comment, setComment] = useState<CommentOut | null>(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);  // Added confirmation state

    const pId = postId ?? (typeof postId === 'string' ? parseInt(postId) : undefined);
    const cId = commentId ?? (typeof commentId === 'string' ? parseInt(commentId) : undefined);

    if (!pId) return null;

    useEffect(() => {
        if (!pId || !cId) return;

        const fetchComment = async () => {
            const [d, e] = await getCommentById(pId, cId);
            if (e) setError(e);
            else setComment(d);
            setLoading(false);
        };

        fetchComment();
    }, [pId, cId]);

    const handleSuccess = (newComment: CommentOut) => {
        if (!comment) return;
        const updated = insertComment([comment], newComment)[0];
        setComment(updated);
        setShowReplyForm(false);
    };

    const handleDelete = async () => {
        if (!cId) return;
        setDeleting(true);
        const [_, deleteError] = await deleteCommentById(pId, cId);
        setDeleting(false);
        if (deleteError) setError(deleteError);
        else {
            setComment(null);
            setConfirmDelete(false);
        }
    };

    if (loading) return <div>Loading comment...</div>;
    if (error) return <div>Error Loading Comment: {error}</div>;
    if (comment === null) return <div>Comment deleted or not found.</div>;

    return (
        <>
            <Link href={`garden-of-support/posts/${postId}/comments/${commentId}`}><h6>{comment.temporary_username}</h6></Link>
            <h4>
                Content Warnings:{' '}
                {comment.content_warnings.map((w) => (<ContentWarningBadge key={w} warningId={w} />))}
            </h4>
            <p>{comment.content}</p>

            {currentUser?.id === comment.user_id && (
                <>
                    {!confirmDelete ? (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            disabled={deleting}
                            style={{ color: 'red' }}
                        >
                            Delete Comment
                        </button>
                    ) : (
                        <div>
                            <span>Are you sure? </span>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                { deleting ? 'Deleting...' : 'Yes' }
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleting}
                            >
                                No
                            </button>
                        </div>
                    )}
                </>
            )}

            <button onClick={() => setShowReplyForm(!showReplyForm)}>
                {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
            {showReplyForm && (<CommentForm postId={pId} parentCommentId={comment.id} onSuccess={handleSuccess} />)}
            {comment.replies?.map((reply) => (<Comment key={reply.id} postId={pId} commentId={reply.id} />))}
        </>
    );
};
