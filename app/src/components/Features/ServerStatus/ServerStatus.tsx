import React, { useState, useEffect } from 'react';

export const ServerStatus: React.FC = () => {
    const [isServerRunning, setIsServerRunning] = useState<boolean | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(`${apiUrl}`, {
                    method: 'GET',
                    signal: controller.signal,
                });
                
                clearTimeout(timeoutId);
                setIsServerRunning(response.ok);
            } catch (error) {
                console.error("Server check failed:", error);
                setIsServerRunning(false);
            }
        };
        
        checkServerStatus();
        
        // Check server status every 30 seconds
        const intervalId = setInterval(checkServerStatus, 30000);
        
        return () => clearInterval(intervalId);
    }, [apiUrl]);
    
    return (
        <div className="server-status" style={{ padding: '10px', margin: '10px 0' }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '14px'
            }}>
                <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: 
                        isServerRunning === null ? 'gray' : 
                        isServerRunning ? 'green' : 'red',
                    marginRight: '8px'
                }}></div>
                Server Status: {
                    isServerRunning === null ? 'Checking...' : 
                    isServerRunning ? 'Online' : 'Offline - please start the server'
                }
            </div>
        </div>
    );
};
