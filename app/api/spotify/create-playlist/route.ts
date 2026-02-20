import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  refreshAccessToken,
  createPlaylist,
  addTracksToPlaylist,
  uploadPlaylistImage,
  getPlaylistDetails,
} from '@/lib/spotify';
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

/**
 * Force-refresh session token (when Spotify returns 401 even if expiresAt says it's ok).
 * Returns the new access token or null if refresh is not possible.
 */
async function refreshSessionTokenIfPossible(): Promise<string | null> {
  const session = await getSession();

  if (!session.refreshToken) return null;

  try {
    const data = await refreshAccessToken(session.refreshToken);
    session.accessToken = data.access_token;
    session.expiresAt = Date.now() + data.expires_in * 1000;
    await session.save();
    return session.accessToken;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const uiMessages: string[] = [];

  const createErrorResponse = (
    status: number,
    errorCode: string,
    message: string,
    details?: Record<string, unknown>
  ) => NextResponse.json({ errorCode, message, details }, { status });

  try {
    let accessToken = await getValidAccessToken();
    const session = await getSession();

    const sessionInfo = {
      hasAccessToken: !!accessToken,
      hasUser: !!session.user,
      userId: session.user?.id,
      userEmail: session.user?.email,
      hasRefreshToken: !!session.refreshToken,
      expiresAt: session.expiresAt,
    };

    console.log('Session check:', sessionInfo);

    if (!accessToken || !session.user) {
      return createErrorResponse(401, 'NOT_AUTHENTICATED', 'Not authenticated');
    }

    if (!session.user.id) {
      console.error('User ID is missing from session');
      return createErrorResponse(400, 'MISSING_USER_ID', 'User ID not found in session');
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
      return createErrorResponse(400, 'MISSING_REQUIRED_FIELDS', 'Missing required fields', {
        required: ['name', 'trackUris'],
      });
    }

    console.log(`Creating playlist "${name}" with ${trackUris.length} tracks for user ${session.user.id}`);
    console.log('First 5 track URIs:', trackUris.slice(0, 5));

    console.log('========== BEGINNING PLAYLIST CREATION ==========');

    // Create playlist
    const playlist = await createPlaylist(
      accessToken,
      session.user.id,
      name,
      description || 'Created with RollPlay'
    );

    console.log(`✓ Playlist created successfully: ${playlist.id}`);
    console.log(`✓ Playlist URL: ${playlist.url}`);
    uiMessages.push('Playlist criada com sucesso.');

    // Small delay to ensure playlist is ready (Spotify sometimes needs time to process)
    console.log('⏳ Waiting 500ms for Spotify to process playlist...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('✓ Delay complete, preparing to add tracks...');

    // Verify playlist ownership and permissions
    try {
      const playlistDetails = await getPlaylistDetails(accessToken, playlist.id);
      console.log('📋 Playlist details:', {
        owner: playlistDetails.owner.id,
        public: playlistDetails.public,
        collaborative: playlistDetails.collaborative,
        name: playlistDetails.name,
      });
    } catch (verifyError: any) {
      console.error('Failed to verify playlist details:', verifyError);
    }

    // Add tracks to playlist (retry 1x on 401 by forcing refresh)
    try {
      console.log(`🎵 About to add ${trackUris.length} tracks to playlist ${playlist.id}`);
      console.log(`📡 Will POST to: https://api.spotify.com/v1/playlists/${playlist.id}/tracks`);
      console.log(`📦 Request body will contain ${trackUris.length} URIs`);

      try {
        await addTracksToPlaylist(accessToken, playlist.id, trackUris);
      } catch (addError: any) {
        const msg = String(addError?.message || '');
        console.error('❌ addTracksToPlaylist failed:', msg);

        // If it's likely a 401, try refresh + retry once
        if (msg.includes('401')) {
          console.log('🔁 Detected 401, attempting forced token refresh and retry 1x...');
          const newToken = await refreshSessionTokenIfPossible();

          if (newToken) {
            accessToken = newToken; // keep for next steps (like image upload)
            console.log('✅ Token refreshed, retrying addTracksToPlaylist...');
            await addTracksToPlaylist(newToken, playlist.id, trackUris);
          } else {
            console.error('❌ Could not refresh token (no refresh_token or refresh failed).');
            throw addError;
          }
        } else {
          throw addError;
        }
      }

      console.log(`✓ All ${trackUris.length} tracks added successfully`);
      uiMessages.push(`${trackUris.length} músicas adicionadas à playlist.`);
    } catch (addError: any) {
      console.error('Failed to add tracks:', addError);

      // Return playlist URL even if adding tracks failed
      return NextResponse.json(
        {
          spotifyPlaylistUrl: playlist.url,
          playlistId: playlist.id,
          messages: [...uiMessages, 'Playlist criada, mas houve falha ao adicionar músicas.'],
          warning: 'Playlist criada, mas houve falha ao adicionar músicas.',
          errorCode: 'TRACKS_ADD_FAILED',
          details: {
            trackCount: trackUris.length,
          },
        },
        { status: 207 } // 207 Multi-Status
      );
    }

    // Upload custom playlist image (RollPlay logo)
    try {
      const imagePath = join(process.cwd(), 'public', 'img_capa.png');
      const imageBuffer = readFileSync(imagePath);

      await uploadPlaylistImage(accessToken, playlist.id, imageBuffer);
      console.log('Playlist cover image uploaded successfully');
    } catch (imageError: any) {
      console.warn('Failed to upload playlist image (non-critical):', imageError.message);
      uiMessages.push('Playlist criada, mas não foi possível definir a capa automaticamente.');
      // Don't fail the request if image upload fails
    }

    return NextResponse.json({
      spotifyPlaylistUrl: playlist.url,
      playlistId: playlist.id,
      messages: uiMessages,
    });
  } catch (error: any) {
    console.error('Create playlist error:', error);
    return createErrorResponse(500, 'PLAYLIST_CREATION_FAILED', 'Failed to create playlist', {
      reason: error?.message || 'Unknown error',
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
