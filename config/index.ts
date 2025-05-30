import type { AppInfo } from '@/types/app'
// export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
// export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
// export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_ID = `${process.env.APP_ID}`
export const API_KEY = `${process.env.APP_KEY}`
export const API_URL = `${process.env.API_URL}`
export const APP_INFO: AppInfo = {
  // title: 'Chat APP',
  title: 'Smart knowledge base di SBNP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
}

export const isShowPrompt = false
export const promptTemplate = ''

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
