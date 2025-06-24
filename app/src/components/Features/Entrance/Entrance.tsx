import Link from 'next/link';

export const Entrance = () => {
    return (
        <>
            <h1>Nurture Nook</h1>
            <Link href='/register'>
                <button>enter</button>
            </Link>
        </>
    )
}
