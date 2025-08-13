import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserPrivate } from '@/types/user';
import { Login } from '../components/Features/Login/Login';
import { CurrentUserContext } from '@/contexts/current_user_context';

export default function LoginPage() {
    const router = useRouter()
    
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (currentUser) router.push('/home');
    }, [currentUser, router])

    if (!isReady) return <p>Loading...</p>;

    

    const handleLoginSuccess = async (newUser : UserPrivate) => {
        setCurrentUser(newUser)
        router.push('/home')
    }

    return (
        <div>
            <Login onLoginSuccess={handleLoginSuccess}/>
        </div>
    )
}
