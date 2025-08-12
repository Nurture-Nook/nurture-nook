import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { EditMyProfile } from "@/components/Features/Profile/EditMyProfile";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const Edit = () => {
    const { currentUser } = useContext(CurrentUserContext);

    const router = useRouter();

    if (!currentUser) {
        router.push('/entrance')
    }

    return <>
        <Link href="/me">Return to Profile</Link>
        <EditMyProfile/>
    </>
}
