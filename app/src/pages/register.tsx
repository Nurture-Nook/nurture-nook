import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserPrivate } from '@/types/user';
import { Register } from '../components/Features/Register/Register';
import { ServerStatus } from '../components/Features/ServerStatus/ServerStatus';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { getCurrentUser } from '@/adapters/authAdapters';

export default function RegisterPage() {
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    
    const router = useRouter();

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (currentUser) router.push('/home');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    const handleRegistrationSuccess = (user: UserPrivate) => {
        setCurrentUser(user);
        router.push('/home');
    }

    return (
        <div>
            <ServerStatus />
            <Register onRegisterSuccess={handleRegistrationSuccess}/>
        </div>
    )
}
