import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserPrivate } from '@/types/user';
import { Register } from '../components/Features/Register/Register';
import { CurrentUserContext } from '@/contexts/current_user_context';

export const RegisterPage = () => {
    const router = useRouter()

    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/home')
    }, [currentUser])

    const handleRegistrationSuccess = async (newUser : UserPrivate) => {
        setCurrentUser(newUser)
        router.push('/home')
    }

    return (
        <div>
            <Register onRegisterSuccess={handleRegistrationSuccess}/>
        </div>
    )
}
