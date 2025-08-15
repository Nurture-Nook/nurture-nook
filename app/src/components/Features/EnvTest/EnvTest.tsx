import React, { useEffect, useState } from 'react';

export const EnvTest: React.FC = () => {
    const [apiBase, setApiBase] = useState<string | undefined>('');
    
    useEffect(() => {
        setApiBase(process.env.NEXT_PUBLIC_API_BASE);
        console.log('Environment variables in component:', {
            NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE
        });
    }, []);

    return (
        <div className="env-test">
            <h2>Environment Test</h2>
            <p>API Base URL: {apiBase || 'Not defined'}</p>
        </div>
    );
};
