import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { MyPosts } from "@/components/Features/Profile/MyPosts";
import { CurrentUserContext } from "@/contexts/current_user_context";
import Link from "next/link";

export default function PostsPage() {
    const { currentUser } = useContext(CurrentUserContext);

    const router = useRouter();

    const [isReady, setIsReady] = useState(false)
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    if (!isReady) return <p>Loading...</p>;

    if (!currentUser) router.push("/entrance");

    return <>
        <Link href="/me">Return to Profile</Link>
        <MyPosts/>
    </>
}
