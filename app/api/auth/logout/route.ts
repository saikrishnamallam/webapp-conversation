import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response object
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

        // Clear auth token cookie
        response.cookies.set({
            name: 'auth_token',
            value: '',
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 0, // Expire immediately
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during logout'
        }, { status: 500 });
    }
} 