import Link from "next/link"

export const Home = () => {
    return (
        <>
            <Link href={"/garden-of-support"}>Garden of Support</Link>
            <Link href="/nurture-guide">Nurture Guide</Link>
            <Link href="/me">My Profile</Link>
        </>
    )
}
