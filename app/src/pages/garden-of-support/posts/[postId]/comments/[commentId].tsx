import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Comment } from "@/components/Features/SupportGarden/Comment";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { getCommentById } from "@/adapters/commentAdapters";

export default function CommentPage() {
    const router = useRouter();
    
    const currentUser = useContext(CurrentUserContext);
    
    const { postId, commentId } = router.query;
    
    const [isReady, setIsReady] = useState(false)
    const [comment, setComment] = useState(null);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser, router]);

    useEffect(() => {
        if (isReady && postId && commentId) {
            getCommentById(Number(postId), Number(commentId)).then(([data]) => setComment(data));
        }
    }, [isReady, postId, commentId]);

    const handleDelete = async () => {
        await new Promise(res => setTimeout(res, 200));
        const [latestComment] = await getCommentById(Number(postId), Number(commentId));
        setComment(latestComment);
    };
    
    if (!isReady) return <p>Loading...</p>;
    
    if (!postId || !commentId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="support-garden-pages">
            <Link href={`/garden-of-support/posts/${postId}`}>Return to Post</Link>
            <br></br>
            { !comment ? <p>Loading Comment...</p> :
                <Comment postId={Number(postId)} commentId={Number(commentId)} comment={comment} onDelete={handleDelete}/>}
        </div>
    );
};
