import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { getCurrentUser } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for errors
  if (error) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }

  // Verify state
  const storedState = cookies().get('spotify_auth_state')?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL('/login?error=state_mismatch', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  // Clear state cookie
  cookies().delete('spotify_auth_state');

  // Exchange code for tokens
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();

    // Get user profile
    const user = await getCurrentUser(data.access_token);

    console.log('User profile retrieved:', {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
    });

    // Whitelist check - only allow specific user
    const ALLOWED_EMAIL = 'arthurgnascto@gmail.com';
    if (user.email !== ALLOWED_EMAIL) {
      console.warn(`Unauthorized login attempt from: ${user.email}`);
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }

    // Save to session
    const session = await getSession();
    session.accessToken = data.access_token;
    if (data.refresh_token) {
      session.refreshToken = data.refresh_token;
    }
    session.scope = data.scope;
    session.expiresAt = Date.now() + data.expires_in * 1000;
    session.user = {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
    };
    await session.save();

    console.log('Session saved successfully with user ID:', user.id);

    // Redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=token_exchange', request.url));
  }
}
