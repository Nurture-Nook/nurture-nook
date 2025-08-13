import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Home } from '../components/Features/Home/Home';
import { CurrentUserContext } from '@/contexts/current_user_context';

export default function HomePage() {
    const router = useRouter();
    
    const currentUser = useContext(CurrentUserContext);

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (currentUser) router.push('/entrance')
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    return (
        <div>
            <Home/>
        </div>
    )
}
