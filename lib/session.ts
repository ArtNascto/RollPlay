import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData } from '@/types';

// Session configuration
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'rollplay_session',
  ttl: 60 * 60 * 24 * 7, // 7 days
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};

// Get session from cookies
export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
