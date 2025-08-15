import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { SupportGarden } from '../../components/Features/SupportGarden/SupportGarden';
import { CurrentUserContext } from '@/contexts/current_user_context';

export default function SupportGardenPage() {
    const router = useRouter();

    const { currentUser } = useContext(CurrentUserContext);

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (!currentUser) router.push('/entrance');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    return <div className='support-garden-pages'> <SupportGarden /> </div>
}
