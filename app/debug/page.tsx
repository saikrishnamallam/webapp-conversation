'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
    const [authState, setAuthState] = useState<{
        user: any | null;
        error: string | null;
        status: string;
    }>({
        user: null,
        error: null,
        status: 'loading'
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setAuthState(prev => ({ ...prev, status: 'checking' }));

                const response = await fetch('/api/auth/user');
                const data = await response.json();

                if (response.ok) {
                    setAuthState({
                        user: data.user,
                        error: null,
                        status: 'authenticated'
                    });
                } else {
                    setAuthState({
                        user: null,
                        error: data.message || 'Not authenticated',
                        status: 'unauthenticated'
                    });
                }
            } catch (error: any) {
                setAuthState({
                    user: null,
                    error: error.message || 'Error checking auth',
                    status: 'error'
                });
            }
        };

        checkAuth();
    }, []);

    const handleTestLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'saikrishnamallam@live.com',
                    password: 'password123'
                }),
            });

            const data = await response.json();
            alert(JSON.stringify(data));

            // Refresh auth state
            window.location.reload();
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
            // Refresh the page
            window.location.reload();
        } catch (error: any) {
            alert('Error logging out: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Authentication Debug Page</h1>

            <div className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
                <p><strong>Status:</strong> {authState.status}</p>
                {authState.error && (
                    <p className="text-red-500"><strong>Error:</strong> {authState.error}</p>
                )}
                {authState.user && (
                    <div>
                        <p><strong>User ID:</strong> {authState.user.id}</p>
                        <p><strong>Name:</strong> {authState.user.name}</p>
                        <p><strong>Email:</strong> {authState.user.email}</p>
                    </div>
                )}
            </div>

            <div className="flex space-x-4 mb-4">
                <button
                    onClick={handleTestLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Test Login (Krishna)
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="flex space-x-4">
                <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Home
                </Link>
                <Link href="/chat" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Chat
                </Link>
                <Link href="/login" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Login Page
                </Link>
            </div>
        </div>
    );
} 