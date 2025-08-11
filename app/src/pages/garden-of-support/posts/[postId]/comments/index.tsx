import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Comments } from "@/components/Features/SupportGarden/Comments";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const commentsPage = () => {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/home')
    }, [currentUser])

    return <div className="support-garden-pages"> <Comments/> </div>
}
