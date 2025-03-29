import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserByEmail } from '@/utils/db';

// Use a consistent JWT secret - use env variable or fallback if not set
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_it_in_production';

// This config makes Next.js understand this is a dynamic route that shouldn't be built statically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // Get token from cookies
        const cookieStore = cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, email: string, name: string, isAdmin?: boolean };

            // Get user from database
            const user = await getUserByEmail(decoded.email);

            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: 'User not found'
                }, { status: 404 });
            }

            // Return user info (excluding password)
            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: decoded.isAdmin || false
                }
            });
        } catch (tokenError) {
            console.error('Token verification error:', tokenError);
            return NextResponse.json({
                success: false,
                message: 'Invalid token'
            }, { status: 401 });
        }

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({
            success: false,
            message: 'Authentication failed'
        }, { status: 401 });
    }
} 