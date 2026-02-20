import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken, createPlaylist, addTracksToPlaylist, uploadPlaylistImage } from '@/lib/spotify';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    
    console.log('Session check:', {
      hasAccessToken: !!accessToken,
      hasUser: !!session.user,
      userId: session.user?.id,
      userEmail: session.user?.email,
    });
    
    if (!accessToken || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      console.error('User ID is missing from session');
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`Creating playlist "${name}" with ${trackUris.length} tracks for user ${session.user.id}`);

    // Create playlist
    const playlist = await createPlaylist(
      accessToken,
      session.user.id,
      name,
      description || 'Created with RollPlay'
    );

    console.log(`Playlist created successfully: ${playlist.id}`);

    // Add tracks to playlist
    try {
      await addTracksToPlaylist(accessToken, playlist.id, trackUris);
      console.log(`All ${trackUris.length} tracks added successfully`);
    } catch (addError: any) {
      console.error('Failed to add tracks:', addError);
      // Return playlist URL even if adding tracks failed
      return NextResponse.json({
        spotifyPlaylistUrl: playlist.url,
        playlistId: playlist.id,
        warning: `Playlist created but failed to add tracks: ${addError.message}`,
      }, { status: 207 }); // 207 Multi-Status
    }

    // Upload custom playlist image (RollPlay logo)
    try {
      const iconPath = join(process.cwd(), 'public', 'icon-512.png');
      const imageBuffer = readFileSync(iconPath);
      const imageBase64 = imageBuffer.toString('base64');
      
      await uploadPlaylistImage(accessToken, playlist.id, imageBase64);
      console.log('Playlist cover image uploaded successfully');
    } catch (imageError: any) {
      console.warn('Failed to upload playlist image (non-critical):', imageError.message);
      // Don't fail the request if image upload fails
    }

    return NextResponse.json({
      spotifyPlaylistUrl: playlist.url,
      playlistId: playlist.id,
    });
  } catch (error: any) {
    console.error('Create playlist error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create playlist' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
