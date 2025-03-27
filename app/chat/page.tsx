'use client';

import React, { useEffect, useState } from 'react';
import Main from '@/app/components';

export default function ChatPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user information to verify we're authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    console.log('User authenticated:', data.user);
                } else {
                    console.error('Authentication failed:', response.status);
                    // If we get here, middleware should have already redirected
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // If still loading, show loading state
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen">
            {user ? (
                <Main params={{}} />
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    Not authenticated. You should be redirected to login.
                </div>
            )}
        </div>
    );
} 