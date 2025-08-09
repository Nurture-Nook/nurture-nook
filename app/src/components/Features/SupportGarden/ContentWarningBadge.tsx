import { useState, useEffect } from 'react';
import { WarningBadge } from '@/types/warning';
import { getWarningById } from '@/adapters/warningAdapters';

interface WarningBadgeProps {
    warningId: number;
}

export const ContentWarningBadge: React.FC<WarningBadgeProps> = ({ warningId }) => {
    const [contentWarning, setContentWarning] = useState<WarningBadge | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!warningId) return;

       const fetchCategory = async () => {
            const [d, e] = await getWarningById(Number(warningId));

            if (e) setError(e);
            else setContentWarning(d);

            setLoading(false);
        }

        fetchCategory();
    }, [warningId])

    if (loading) return <div>Loading warning name...</div>

    if (error) {
        console.error(error);
        return <div>Error Loading Warning Name</div>
    }

    if (contentWarning === null) return;

    return <p>{ contentWarning.title }</p>
}
