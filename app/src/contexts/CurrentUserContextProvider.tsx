import { ReactNode, useState } from 'react';
import { CurrentUserContext } from './current_user_context';

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);

    return (
        <CurrentUserContext.Provider value={{ userId, setUserId }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

