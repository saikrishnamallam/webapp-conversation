'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../assets/logo-sbnp.png'

type User = {
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
};

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const check = await (await fetch('/api/auth/checkadmin')).json()
                // console.log("response in Navbar is: ", check)
                setIsUserAdmin(check.data)

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    // Also set isAdmin from the user response if available
                    if (data.user && data.user.isAdmin) {
                        setIsUserAdmin(data.user.isAdmin);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Clear user state and redirect to login
            setUser(null);
            setIsUserAdmin(false);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-[#7b2a20]">
                                <Image
                                    src={logo}
                                    alt="Company Logo"
                                    width={200}
                                    height={100}
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {loading ? (
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                {/* Add User button moved to right side */}
                                {isUserAdmin && (
                                    <Link
                                        href="/register"
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#7b2a20] hover:bg-[#612218] rounded-md shadow-sm transition duration-150 ease-in-out"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add User
                                    </Link>
                                )}

                                <div className="relative">
                                    <button
                                        onClick={toggleMenu}
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none border border-transparent hover:border-gray-200 rounded-md px-3 py-2 transition-all duration-150"
                                    >
                                        <span className="mr-2">{user.name}</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {isMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <div className="py-1">
                                                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#7b2a20]">
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#7b2a20]"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-[#7b2a20] border border-[#7b2a20] rounded-md hover:bg-[#7b2a20] hover:text-white transition duration-150 ease-in-out"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7b2a20]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, toggle based on menu state */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-2 px-4">
                        <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                            Home
                        </Link>
                        {/* Add User button for mobile */}
                        {isUserAdmin && user && (
                            <Link
                                href="/register"
                                className="flex items-center justify-center px-3 py-2 text-base font-medium text-white bg-[#7b2a20] hover:bg-[#612218] rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add User
                            </Link>
                        )}
                    </div>

                    {user ? (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-4">
                                <Link href="/profile" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7b2a20] hover:bg-gray-100 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7b2a20] hover:bg-gray-100 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex flex-col space-y-2 px-4">
                                <Link href="/login" className="flex items-center px-3 py-2 text-base font-medium text-[#7b2a20] border border-[#7b2a20] hover:bg-[#7b2a20] hover:text-white rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
} 