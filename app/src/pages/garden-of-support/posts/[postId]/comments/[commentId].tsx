import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Comment } from "@/components/Features/SupportGarden/Comment";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const commentPage = () => {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/home')
    }, [currentUser])

    return <div className="support-garden-pages"> <Comment/> </div>
}
