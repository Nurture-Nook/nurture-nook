import Link from "next/link"

export const Home = () => {
    return (
        <>
            <Link href={"/garden-of-support"}>Garden of Support</Link>
            <br></br>
            {/* <Link href="/nurture-guide">Nurture Guide</Link> <br></br> */}
            <Link href="/me">My Profile</Link>
        </>
    )
}
