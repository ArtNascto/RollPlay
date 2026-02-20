import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    session.destroy();
    
    return NextResponse.redirect(new URL('/login', process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000'));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login', process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000'));
  }
}
