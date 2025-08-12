import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ExperientialCategory } from "@/components/Features/SupportGarden/ExperientialCategory";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const categoryPage = () => {
    const router = useRouter();

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser]);

    return (
        <div className='support-garden-pages'>
            <Link href="/posts/create" passHref>Share Your Experiences</Link>
            <ExperientialCategory />
        </div>
    );
}
