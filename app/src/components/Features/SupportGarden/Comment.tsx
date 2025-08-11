import { useState, useEffect } from 'react';
import { CommentOut } from '../../../types/comment';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getCommentById } from '../../../adapters/commentAdapters';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';

interface CommentProps {
    postId: number;
    commentId: number;
}

export const Comment: React.FC<CommentProps> = ({ postId, commentId }) => {
      const [comment, setComment] = useState<CommentOut | null>(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading comment...</div>;

    if (error) return <div>Error Loading Comment</div>;

    if (comment === null) return null;

    return (
        <>
            <h6>{comment.temporary_username}</h6>
            <h4>
                Content Warnings:{' '}
                {comment.content_warnings.map((w) => (<ContentWarningBadge key={w} warningId={w}/>))}
            </h4>
            <p>{comment.content}</p>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>{showReplyForm ? 'Cancel' : 'Reply'}</button>
            {showReplyForm && (<CommentForm postId={pId} parentCommentId={comment.id} onSuccess={handleSuccess} />)}
            {comment.replies?.map((reply) => (<Comment key={reply.id} postId={pId} commentId={reply.id} />))}
    </>
  );
};
