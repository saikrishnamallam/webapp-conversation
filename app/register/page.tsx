'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)

    const mountFn = async () => {
        try {
            // Fix: Use fetch correctly with a single await
            const response = await fetch('/api/auth/checkadmin');

            if (!response.ok) {
                throw new Error('Failed to check admin status');
            }

            const data = await response.json();
            console.log("response is: ", data);

            if (data.data === false) {
                router.replace('/');
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            router.replace('/');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("Inside mounting useEffect register");
        mountFn();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Redirect to login page on successful registration
            router.push('/login?registered=true');

        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center fixed inset-0 bg-white">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[#7b2a20] border-[#7b2a20] border-t-transparent" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-4 border-red-400">
        <div className="h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new user account
                    </h2>
                    {/*  <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/login" className="font-medium text-[#7b2a20] hover:text-[#612218]">
                            sign in to your account
                        </Link>
                    </p> */}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#7b2a20] focus:border-[#7b2a20] focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#7b2a20] focus:border-[#7b2a20] focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#7b2a20] focus:border-[#7b2a20] focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#7b2a20] focus:border-[#7b2a20] focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7b2a20] hover:bg-[#612218] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7b2a20]"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 