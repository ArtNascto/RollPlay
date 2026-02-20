import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken, createPlaylist, addTracksToPlaylist, uploadPlaylistImage, getPlaylistDetails } from '@/lib/spotify';
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
  const debugLogs: string[] = []; // Array to collect logs for response
  
  try {
    const accessToken = await getValidAccessToken();
    const session = await getSession();
    
    const sessionInfo = {
      hasAccessToken: !!accessToken,
      hasUser: !!session.user,
      userId: session.user?.id,
      userEmail: session.user?.email,
      tokenLength: accessToken?.length,
    };
    console.log('Session check:', sessionInfo);
    debugLogs.push(`Session check: ${JSON.stringify(sessionInfo)}`);
    
    if (!accessToken || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated', debugLogs },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      console.error('User ID is missing from session');
      debugLogs.push('ERROR: User ID is missing from session');
      return NextResponse.json(
        { error: 'User ID not found in session', debugLogs },
        { status: 400 }
      );
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', debugLogs },
        { status: 400 }
      );
    }

    console.log(`Creating playlist "${name}" with ${trackUris.length} tracks for user ${session.user.id}`);
    debugLogs.push(`Creating playlist "${name}" with ${trackUris.length} tracks for user ${session.user.id}`);
    debugLogs.push(`First 5 track URIs: ${JSON.stringify(trackUris.slice(0, 5))}`);
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
    debugLogs.push(`✓ Playlist created: ${playlist.id}`);
    debugLogs.push(`✓ Playlist URL: ${playlist.url}`);

    // Small delay to ensure playlist is ready (Spotify sometimes needs time to process)
    console.log('⏳ Waiting 500ms for Spotify to process playlist...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✓ Delay complete, preparing to add tracks...');
    debugLogs.push('✓ Delay complete, preparing to add tracks');

    // Verify playlist ownership and permissions
    try {
      const playlistDetails = await getPlaylistDetails(accessToken, playlist.id);
      console.log('📋 Playlist details:', {
        owner: playlistDetails.owner.id,
        public: playlistDetails.public,
        collaborative: playlistDetails.collaborative,
        name: playlistDetails.name
      });
      debugLogs.push(`📋 Playlist owner: ${playlistDetails.owner.id}`);
      debugLogs.push(`📋 Current user: ${session.user.id}`);
      debugLogs.push(`📋 Is owner: ${playlistDetails.owner.id === session.user.id}`);
      debugLogs.push(`📋 Public: ${playlistDetails.public}, Collaborative: ${playlistDetails.collaborative}`);
    } catch (verifyError: any) {
      console.error('Failed to verify playlist details:', verifyError);
      debugLogs.push(`⚠️ Failed to verify playlist: ${verifyError.message}`);
    }

    // Add tracks to playlist
    try {
      console.log(`🎵 About to add ${trackUris.length} tracks to playlist ${playlist.id}`);
      console.log('🔑 Using access token (first 20 chars):', accessToken.substring(0, 20) + '...');
      debugLogs.push(`🎵 About to add ${trackUris.length} tracks`);
      debugLogs.push(`🔑 Access token (first 20): ${accessToken.substring(0, 20)}...`);
      debugLogs.push(`🔑 Access token length: ${accessToken.length}`);
      
      // Log the exact request that will be made
      debugLogs.push(`📡 Will POST to: https://api.spotify.com/v1/playlists/${playlist.id}/tracks`);
      debugLogs.push(`📦 Request body will contain ${trackUris.length} URIs`);
      
      await addTracksToPlaylist(accessToken, playlist.id, trackUris);
      console.log(`✓ All ${trackUris.length} tracks added successfully`);
      debugLogs.push(`✓ All ${trackUris.length} tracks added successfully`);
    } catch (addError: any) {
      console.error('Failed to add tracks:', addError);
      debugLogs.push(`❌ Failed to add tracks: ${addError.message}`);
      debugLogs.push(`Error details: ${JSON.stringify(addError)}`);
      
      // Return playlist URL even if adding tracks failed
      return NextResponse.json({
        spotifyPlaylistUrl: playlist.url,
        playlistId: playlist.id,
        warning: `Playlist created but failed to add tracks: ${addError.message}`,
        debugLogs, // Include debug logs in response
      }, { status: 207 }); // 207 Multi-Status
    }

    // Upload custom playlist image (RollPlay logo)
    try {
      const imagePath = join(process.cwd(), 'public', 'img_capa.png');
      const imageBuffer = readFileSync(imagePath);
      
      await uploadPlaylistImage(accessToken, playlist.id, imageBuffer);
      console.log('Playlist cover image uploaded successfully');
      debugLogs.push('✓ Playlist cover image uploaded');
    } catch (imageError: any) {
      console.warn('Failed to upload playlist image (non-critical):', imageError.message);
      debugLogs.push(`⚠️ Failed to upload image: ${imageError.message}`);
      // Don't fail the request if image upload fails
    }

    return NextResponse.json({
      spotifyPlaylistUrl: playlist.url,
      playlistId: playlist.id,
      debugLogs, // Include logs in successful response
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
