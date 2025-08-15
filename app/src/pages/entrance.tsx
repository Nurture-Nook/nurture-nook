import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Entrance } from '../components/Features/Entrance/Entrance';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { getCurrentUser } from '@/adapters/authAdapters';

export default function EntrancePage() {
    const router = useRouter();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // If we already have a user in context, redirect to home
            if (currentUser) {
                console.log("User already logged in, redirecting to home");
                router.push('/home');
                return;
            }
            
            // Check for stored credentials
            const storedToken = localStorage.getItem('auth_token');
            const storedUsername = localStorage.getItem('debug_username');
            
            if (storedToken || storedUsername) {
                try {
                    const [user, error] = await getCurrentUser();
                    
                    if (user && !error) {
                        console.log("Successfully retrieved user, redirecting to home");
                        setCurrentUser(user);
                        router.push('/home');
                        return;
                    }
                } catch (e) {
                    console.error("Error checking authentication:", e);
                }
            }
            
            // If we get here, no valid auth was found
            setIsCheckingAuth(false);
        };
        
        checkAuth();
    }, [currentUser, router, setCurrentUser]);

    if (isCheckingAuth) {
        return <p>Loading...</p>;
    }
    
    return (
        <div>
            <Entrance />
        </div>
    );
}
