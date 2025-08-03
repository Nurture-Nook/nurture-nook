import { useState, useEffect } from 'react';
import { CommentOut } from '../../../types/comment';
import { getCommentById } from '../../../adapters/commentAdapters';

interface CommentProps {
    commentId: number
}

export const Comment: React.FC<CommentProps> = ({ commentId }) => {
    const [comment, setComment] = useState<CommentOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!commentId) return;

        const fetchComment = async () => {
            const [d, e] = await getCommentById(commentId);

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
        <h4>Content Warnings: {comment.content_warnings}</h4>
        <p>{ comment.content }</p>
    </>)
}