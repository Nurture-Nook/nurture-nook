import Link from "next/link";
import { EditMyProfile } from "@/components/Features/Profile/EditMyProfile";

export const Edit = () => {
    return <>
        <Link href="/me">Return to Profile</Link>
        <EditMyProfile/>
    </>
}
