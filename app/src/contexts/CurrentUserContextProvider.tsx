import { ReactNode, useState } from 'react';
import { CurrentUserContext } from './current_user_context';

interface ProviderProps {
    children: ReactNode;
}

export default function CurrentUserContextProvider({ children } : ProviderProps) {
    const [currentUser, setCurrentUser] = useState(null);
    const context = { currentUser, setCurrentUser };

    return (
        <CurrentUserContext.Provider value={context}>
            {children}
        </CurrentUserContext.Provider>
    );
}
