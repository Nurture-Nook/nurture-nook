import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Comment } from "@/components/Features/SupportGarden/Comment";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function CommentPage() {
    const router = useRouter();
    
    const currentUser = useContext(CurrentUserContext);
    
    const { postId, commentId } = router.query;
    
    const [isReady, setIsReady] = useState(false)
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser, router]);
    
    if (!isReady) return <p>Loading...</p>;
    
    if (!postId || !commentId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="support-garden-pages">
            <Link href={`/garden-of-support/posts/${postId}`}>Back to Post</Link>
            <Comment postId={Number(postId)} commentId={Number(commentId)}/>
        </div>
    );
};
