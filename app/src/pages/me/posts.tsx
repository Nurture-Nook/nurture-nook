import { useContext } from "react";
import { useRouter } from "next/router";
import { MyPosts } from "@/components/Features/Profile/MyPosts";
import { CurrentUserContext } from "@/contexts/current_user_context";
import Link from "next/link";

export const PostsPage = () => {
    const { currentUser } = useContext(CurrentUserContext);

    const router = useRouter();

    if (!currentUser) router.push("/entrance");

    return <>
        <Link href="/me">Return to Profile</Link>
        <MyPosts/>
    </>
}
