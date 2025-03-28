import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '@/utils/db';

// Use a consistent JWT secret - use env variable or fallback if not set
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_it_in_production';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Email and password are required'
            }, { status: 400 });
        }

        // Check if user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        console.log('user is: ', user)

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('Generated token:', token.substring(0, 20) + '...');

        // Create the response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

        // Set cookie with token - updated settings for better compatibility
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day in seconds
            path: '/'
        });

        // response.cookies.set({
        //     name: 'user_id',
        //     value: user.id
        // })

        console.log('Set auth_token cookie with token');
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during login'
        }, { status: 500 });
    }
} 