import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { NurtureGuide } from "@/components/Features/NurtureGuide/NurtureGuide";
import { CurrentUserContext } from "@/contexts/current_user_context";

export default function NurtureGuidePage() {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/entrance')
    }, [currentUser, router])

    return (
        <NurtureGuide/>
    );
}
