import { createContext } from 'react';

type CurrentUserContextType = {
    currentUser: number | null;
    setCurrentUser: (id: number | null) => void;
};

export const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    setCurrentUser: () => { }
});
