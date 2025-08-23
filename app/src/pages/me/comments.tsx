import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { MyComments } from "@/components/Features/Profile/MyComments";
import { CurrentUserContext } from "@/contexts/current_user_context";
import Link from "next/link";

export default function CommentsPage() {
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
        <h3>My Comments</h3>
        <MyComments/>
    </>
}
