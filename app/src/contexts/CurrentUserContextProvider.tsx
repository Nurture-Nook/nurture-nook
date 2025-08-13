import { ReactNode, useState } from 'react';
import { CurrentUserContext } from './current_user_context';
import { UserPrivate } from '@/types/user';

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserPrivate | null>(null);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
