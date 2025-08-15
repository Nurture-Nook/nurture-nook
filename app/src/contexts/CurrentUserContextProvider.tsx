import { ReactNode, useState, useEffect } from 'react';
import { CurrentUserContext } from './current_user_context';
import { UserPrivate } from '@/types/user';
import { getCurrentUser } from '@/adapters/authAdapters';

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserPrivate | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if we have auth token in local storage
        const loadUser = async () => {
            if (typeof window === 'undefined') return; // Skip on server-side
            
            const storedToken = localStorage.getItem('auth_token');
            const storedUsername = localStorage.getItem('debug_username');
            
            if (storedToken || storedUsername) {
                try {
                    console.log("Context provider: found credentials, attempting to load user");
                    const [user, error] = await getCurrentUser();
                    
                    if (user && !error) {
                        console.log("Context provider: Successfully loaded user from stored credentials");
                        setCurrentUser(user);
                    } else {
                        console.log("Context provider: Failed to load user from stored credentials");
                    }
                } catch (e) {
                    console.error("Context provider: Error loading user from stored credentials:", e);
                }
            }
            
            setIsLoading(false);
        };
        
        loadUser();
    }, []);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
