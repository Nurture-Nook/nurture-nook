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

       const fetchWarning = async () => {
            try {
                const [data, err] = await getWarningById(Number(warningId));

                if (err) {
                    console.error("Error fetching warning:", err);
                    setError(err.message || "Failed to load warning");
                } else if (data) {
                    setContentWarning(data);
                } else {
                    setError("Warning not found");
                }
            } catch (e) {
                console.error("Exception in fetchWarning:", e);
                setError(e instanceof Error ? e.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchWarning();
    }, [warningId])

    if (loading) return <div>Loading warning name...</div>

    if (error) {
        console.error("Error in ContentWarningBadge:", error);
        return <div>Error Loading Warning</div>;
    }

    if (!contentWarning) {
        return <div>Warning not Found</div>;
    }

    return <p>{ contentWarning.title }</p>
}
