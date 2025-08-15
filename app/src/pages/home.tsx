import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Home } from '../components/Features/Home/Home';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { getCurrentUser } from '@/adapters/authAdapters';

export default function HomePage() {
    const router = useRouter();
    
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    const [isReady, setIsReady] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        const checkAuthentication = async () => {
            setIsCheckingAuth(true);
            
            // If we already have a user in context, we're good
            if (currentUser) {
                console.log("Current user found in context, staying on home page:", currentUser);
                setIsCheckingAuth(false);
                return;
            }
            
            // Try to get user from localStorage or API
            const storedToken = localStorage.getItem('auth_token');
            const storedUsername = localStorage.getItem('debug_username');
            
            if (storedToken || storedUsername) {
                console.log("Found stored credentials, attempting to fetch user");
                try {
                    // Try to get the user data
                    const [user, error] = await getCurrentUser();
                    
                    if (user && !error) {
                        console.log("User retrieved successfully:", user);
                        setCurrentUser(user);
                        setIsCheckingAuth(false);
                        return;
                    }
                } catch (e) {
                    console.error("Error fetching user data:", e);
                }
            }
            
            // If we get here, we couldn't authenticate
            console.log("No current user found, redirecting to entrance");
            setIsCheckingAuth(false);
            router.push('/entrance');
        };
        
        if (isReady) {
            checkAuthentication();
        }
    }, [currentUser, router, isReady, setCurrentUser])

    if (!isReady || isCheckingAuth) return <p>Loading...</p>;

    return (
        <div>
            <Home/>
        </div>
    )
}
