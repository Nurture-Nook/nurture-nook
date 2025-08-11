import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Post } from "@/components/Features/SupportGarden/Post";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const postPage = () => {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/entrance')
    }, [currentUser])

    return <div className='support-garden-pages'> <Post/> </div>
}
