import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'
import { db } from '@/utils/dbPrismaClient'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_it_in_production';

interface currPayload {
  userId: string,
  email: string,
  name: string,
  isAdmin: boolean,
  iat: number,
  exp: number
}

export const getInfo = async (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()

  const authCookie = cookies().get('auth_token')?.value
  // const authCookie = request.cookies.get('auth_token')?.value || ''

  // console.log("authCookie is: ", authCookie)

  let decoded: { userId: string, isAdmin: boolean } | currPayload = {
    userId: '',
    isAdmin: false,
  };

  // const currentUserId = request.cookies.get('auth')?.value || ''
  if (authCookie) {
    decoded = jwt.verify(authCookie || '', JWT_SECRET) as currPayload
  }

  // console.log("decoded isAdmin is: ", decoded.isAdmin)
  const currentUserId = decoded.userId
  // const currentUserId = 'user'

  const isUserAdmin = decoded.isAdmin
  // const isUserAdmin = false
  // console.log('isUserAdmin in common is: ', isUserAdmin)
  const userPrefix = `${currentUserId}_${APP_ID}:`
  // const userPrefix = `user_${APP_ID}:`
  // const user = userPrefix + sessionId
  const user = userPrefix
  // const user = userPrefix + sessionId
  return {
    sessionId,
    user,
    isUserAdmin
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
