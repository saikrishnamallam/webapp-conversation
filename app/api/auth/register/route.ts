import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '@/utils/db';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Name, email, and password are required'
            }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User with this email already exists'
            }, { status: 409 });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = await createUser(name, email, hashedPassword);

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            userId
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during registration'
        }, { status: 500 });
    }
} 