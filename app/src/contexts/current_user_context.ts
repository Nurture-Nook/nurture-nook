import { createContext } from 'react';
import { UserPrivate } from '@/types/user';

type CurrentUserContextType = {
    currentUser: UserPrivate | null;
    setCurrentUser: (user: UserPrivate | null) => void;
};

export const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    setCurrentUser: () => { }
});
