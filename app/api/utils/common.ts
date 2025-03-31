import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_it_in_production';

export const dynamic = "force-dynamic";

interface currPayload {
  userId: string,
  email: string,
  name: string,
  isAdmin: boolean,
  iat: number,
  exp: number
}

export const getInfo = async (request: NextRequest) => {
  try {
    // const sessionId = request.cookies.get('session_id')?.value || v4()
    const sessionId = cookies().get('session_id')?.value || v4()
    const authCookie = cookies().get('auth_token')?.value
    // const authCookie = request.cookies.get('auth_token')?.value

    let decoded: { userId: string, isAdmin: boolean } | currPayload = {
      userId: '',
      isAdmin: false,
    };

    if (authCookie) {
      try {
        decoded = jwt.verify(authCookie, JWT_SECRET) as currPayload
      } catch (error) {
        console.error('JWT verification error:', error);
        // Continue with default decoded values
      }
    }

    const currentUserId = decoded.userId || ''
    const isUserAdmin = decoded.isAdmin || false
    const userPrefix = currentUserId ? `${currentUserId}_${APP_ID}:` : `anonymous_${APP_ID}:`
    const user = userPrefix

    return {
      sessionId,
      user,
      isUserAdmin
    }
  } catch (error) {
    console.error('Error in getInfo:', error);
    // Return default values if something goes wrong
    return {
      sessionId: v4(),
      user: `anonymous_${APP_ID}:`,
      isUserAdmin: false
    }
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

// Only create the client if API_KEY and API_URL are available
export const client = typeof API_KEY === 'string' && API_KEY
  ? new ChatClient(API_KEY, API_URL || undefined)
  : null;
