import { useState, useContext, useEffect } from 'react';
import { createComment } from '@/adapters/commentAdapters';
import { fetchWarnings } from '@/adapters/warningAdapters';
import { WarningBadge } from '@/types/warning';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { CommentOut } from '@/types/comment';

interface CommentFormProps {
    postId: number;
    parentCommentId: number | null;
    onSuccess: (newComment: CommentOut) => void
}

export const CommentForm = ({postId, parentCommentId, onSuccess}: CommentFormProps) => {
    const { currentUser } = useContext(CurrentUserContext);
    const [errorText, setErrorText] = useState("");
    const [content, setContent] = useState("");
    const [warnings, setWarnings] = useState<WarningBadge[]>([]);
    const [warningsSelectedIds, setWarningsSelectedIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);

    if (!currentUser) return;
    const user_id = currentUser.id;

    useEffect(() => {
        const getWarnings = async () => {
            const [d, e] = await fetchWarnings();

            if (e) setErrorText(e);
            else setWarnings(d);

            setLoading(false);
        }

        getWarnings();
    }, [])

    const handleWarningToggle = (id: number) => {
        setWarningsSelectedIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!content || content.trim().length === 0) return setErrorText("Content is Necessary");

        setLoading(true);

        try {
            const [newComment, error] = await createComment(content, warningsSelectedIds, user_id, postId, parentCommentId);

            if (error || !newComment) {
            setErrorText("Failed to Create Comment");
            console.error("Failed to create comment:", error);
            return;
            }

            onSuccess(newComment);

            setContent("");
            setWarningsSelectedIds([]);
        } catch (error) {
            setErrorText("Failed to Create Comment");
            console.error("Failed to create comment: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <p>{errorText}</p>
            
            <form onSubmit={handleSubmit} className="post-form">
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="write content..."
                    disabled={loading}
                    className='input-field'
                />
                <h4>Select Content Warnings</h4>
                {warnings.map(w => (
                    <label key={w.id}>
                        <input
                            type="checkbox"
                            checked={warningsSelectedIds.includes(w.id)}
                            onChange={() => handleWarningToggle(w.id)}
                        />
                        { w.title }
                    </label>
                ))}
            </form>
        </>
    )
}
