import { useState, useEffect } from 'react';
import { CommentOut } from '../../../types/comment';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getCommentById } from '../../../adapters/commentAdapters';

interface CommentProps {
    postId: number
    commentId: number
}

export const Comment: React.FC<CommentProps> = ({ postId, commentId }) => {
    const [comment, setComment] = useState<CommentOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!commentId) return;

        const fetchComment = async () => {
            const [d, e] = await getCommentById(postId, commentId);

            if (e) setError(e);
            else setComment(d);

            setLoading(false);
        }

        fetchComment();
    }, [commentId]);

    if (loading) return <div>Loading comment...</div>

    if (error) return <div>Error Loading Comment</div>

    if (comment === null) return;

    return (<>
        <h6>{ comment.temporary_username }</h6>
        <h4>Content Warnings: { comment.content_warnings.map(w => <ContentWarningBadge warningId={w}/>) }</h4>
        <p>{ comment.content }</p>
    </>)
}
