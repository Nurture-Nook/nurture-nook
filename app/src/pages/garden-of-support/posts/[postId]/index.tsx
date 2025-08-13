import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Post } from "@/components/Features/SupportGarden/Post";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function PostPage() {
    const currentUser = useContext(CurrentUserContext);
    
    const router = useRouter();

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    return <div className='support-garden-pages'> <Post/> </div>
}
