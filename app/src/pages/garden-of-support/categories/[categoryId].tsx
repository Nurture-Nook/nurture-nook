import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ExperientialCategory } from "@/components/Features/SupportGarden/ExperientialCategory";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const categoryPage = () => {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/home')
    }, [currentUser])

    return <div className='support-garden-pages'> <ExperientialCategory/> </div>
}
