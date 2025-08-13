import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { EditMyProfile } from "@/components/Features/Profile/EditMyProfile";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function EditPage() {
    const { currentUser } = useContext(CurrentUserContext);

    const router = useRouter();

    const [isReady, setIsReady] = useState(false)
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    if (!isReady) return <p>Loading...</p>;

    if (!currentUser) {
        router.push('/entrance')
    }

    return <>
        <Link href="/me">Return to Profile</Link>
        <EditMyProfile/>
    </>
}
