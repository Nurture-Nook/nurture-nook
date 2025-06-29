import { useRouter } from 'next/router';
import { SupportGarden } from '../../components/Features/SupportGarden/SupportGarden';

export const SupportGardenPage = () => {
    const router = useRouter();
    const slug = router.query.slug;

    if (!slug) {
        return (
            <div>
                <SupportGarden />
            </div>
        )
    } else {
        // render dynamic content
    }
}