import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken, createPlaylist, addTracksToPlaylist } from '@/lib/spotify';

// Get valid access token, refreshing if needed
async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();
  
  if (!session.accessToken) {
    return null;
  }

  // Check if token is expired
  if (session.expiresAt && Date.now() >= session.expiresAt) {
    if (session.refreshToken) {
      try {
        const data = await refreshAccessToken(session.refreshToken);
        session.accessToken = data.access_token;
        session.expiresAt = Date.now() + data.expires_in * 1000;
        await session.save();
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  return session.accessToken;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getValidAccessToken();
    const session = await getSession();
    
    if (!accessToken || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create playlist
    const playlist = await createPlaylist(
      accessToken,
      session.user.id,
      name,
      description || 'Created with RollPlay'
    );

    // Add tracks to playlist
    await addTracksToPlaylist(accessToken, playlist.id, trackUris);

    return NextResponse.json({
      spotifyPlaylistUrl: playlist.url,
      playlistId: playlist.id,
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
