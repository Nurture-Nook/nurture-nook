import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { CommentOut } from '../../../types/comment';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getCommentById, deleteCommentById } from '../../../adapters/commentAdapters';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { useRouter } from 'next/router';

interface CommentProps {
    postId: number;
    commentId: number;
    comment?: CommentOut;
    nesting?: number;
}

export const Comment: React.FC<CommentProps> = ({ postId, commentId, comment: commentProp, nesting = 0 }) => {
    const { currentUser } = useContext(CurrentUserContext);
    const [comment, setComment] = useState<CommentOut | null>(commentProp ?? null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(!commentProp);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const router = useRouter();

    const pId = postId ?? (typeof postId === 'string' ? parseInt(postId) : undefined);
    const cId = commentId ?? (typeof commentId === 'string' ? parseInt(commentId) : undefined);

    // Detect if we're on the comment page by comparing query param
    const isCommentPage = String(router.query.commentId) === String(commentId);

    // Always start with replies hidden, so the button is always available
    const [showReplies, setShowReplies] = useState(false);

    useEffect(() => {
        if (commentProp) {
            setComment(commentProp);
            setLoading(false);
            return;
        }
        if (!pId || !cId) return;

        const fetchComment = async () => {
            const [d, e] = await getCommentById(pId, cId);
            if (e) setError(e);
            else setComment(d);
            setLoading(false);
        };

        fetchComment();
    }, [pId, cId, commentProp]);

    const handleSuccess = (newComment: CommentOut) => {
        if (!comment) return;
        const updated = insertComment([comment], newComment)[0];
        setComment(updated);
        setShowReplyForm(false);
    };
    
    const handleDelete = async () => {
        if (!cId) return;
        setDeleting(true);
        const [, deleteError] = await deleteCommentById(pId, cId);
        setDeleting(false);
        if (deleteError) setError(deleteError);
        else {
            setComment(null);
            setConfirmDelete(false);
        }
    };

    if (loading) return <div>Loading comment...</div>;
    if (error) return <div>Error Loading Comment: {error}</div>;
    if (comment === null) return <div>Comment Deleted or Not Found.</div>;

    if (comment.is_deleted) {
        return (
            <div className="deleted-comment">
                <p><em>{comment.content}</em></p>
                {comment.replies?.map((reply) => (<Comment key={reply.id} postId={pId} commentId={reply.id} />))}
            </div>
        );
    }

    return (
        <>
            <Link href={`/garden-of-support/posts/${postId}/comments/${commentId}`}>
                <h6 style={{ cursor: 'pointer', textDecoration: 'underline' }}>{comment.temporary_username}</h6>
            </Link>
            {comment.warnings && comment.warnings.length === 0 ? <h4>No Content Warnings</h4> : (
                <h4>
                    Content Warnings:{' '}
                    {comment.warnings?.map((w) => (<ContentWarningBadge key={w} warningId={w} />))}
                </h4>
            )}
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
            {/* Always open comment form when clicking reply */}
            <button onClick={() => setShowReplyForm(true)}>
                Reply
            </button>
            {showReplyForm && (
                <CommentForm postId={postId} parentCommentId={comment.id} onSuccess={handleSuccess} />
            )}
            {/* Always show replies button if there are replies */}
            {comment.replies && comment.replies.length > 0 && (
                <>
                    {/* Always render the button, even on commentId page */}
                    <button onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
                    </button>
                    {showReplies && (
                        comment.replies.map((reply) => (
                            <div key={reply.id} style={{ marginLeft: 24 }}>
                                {nesting < 1 ? (
                                    <Comment postId={postId} commentId={reply.id} comment={reply} nesting={nesting + 1} />
                                ) : (
                                    <Link href={`/garden-of-support/posts/${postId}/comments/${reply.id}`}>
                                        <button>View Reply</button>
                                    </Link>
                                )}
                            </div>
                        ))
                    )}
                </>
            )}
            {/* Show "Back to Parent Thread" only on commentId page */}
            {isCommentPage && comment.parent_comment_id && (
                <Link href={`/garden-of-support/posts/${postId}/comments/${comment.parent_comment_id}`}>
                    <button style={{ margin: '8px 0' }}>Back to Parent Thread</button>
                </Link>
            )}
        </>
    )
}