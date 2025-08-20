import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Comments } from "@/components/Features/SupportGarden/Comments";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function CommentsPage() {
    const currentUser = useContext(CurrentUserContext);
    
    const router = useRouter()

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    const postId = Number(router.query.postId);

    return <div className="support-garden-pages"> (<>
        <Link href={`/garden-of-support/posts/${postId}`}>Return to Post</Link>
        <br></br>
        <Comments/></>
    ) </div>
}
