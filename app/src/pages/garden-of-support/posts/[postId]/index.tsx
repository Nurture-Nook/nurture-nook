import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Post } from "@/components/Features/SupportGarden/Post";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function PostPage() {
    const { currentUser } = useContext(CurrentUserContext);
    
    const router = useRouter();

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (currentUser === null) router.push('/entrance');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    // Ensure postId is valid before rendering Post component
    const { postId } = router.query;
    if (!postId || Array.isArray(postId)) {
        return <div className='support-garden-pages'>Invalid post ID</div>;
    }

    return (
        <div className='support-garden-pages'>
            <Link href={`/garden-of-support`}>Return to Garden of Support</Link>
            <br></br>
            <Post/>
        </div>
    );
}
