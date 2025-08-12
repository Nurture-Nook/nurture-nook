import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { SupportGarden } from '../../components/Features/SupportGarden/SupportGarden';
import { CurrentUserContext } from '@/contexts/current_user_context';

export const SupportGardenPage = () => {
    const router = useRouter()

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) router.push('/entrance')
    }, [currentUser])

    return <div className='support-garden-pages'> <SupportGarden /> </div>
}
