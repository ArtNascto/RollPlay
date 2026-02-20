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
import { ensureSpotifyCompatibleJpeg } from '@/lib/image';

// Get valid access token, refreshing if needed
async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();

  if (!session.accessToken) {
    return null;
  }

  if (session.expiresAt && Date.now() >= session.expiresAt) {
    if (session.refreshToken) {
      try {
        const data = await refreshAccessToken(session.refreshToken);
        session.accessToken = data.access_token;
        session.expiresAt = Date.now() + data.expires_in * 1000;
        await session.save();
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  return session.accessToken;
}

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
  const messages: string[] = [];

  const createErrorResponse = (
    status: number,
    errorCode: string,
    message: string,
    details?: Record<string, unknown>
  ) => NextResponse.json({ errorCode, message, details }, { status });

  try {
    let accessToken = await getValidAccessToken();
    const session = await getSession();

    if (!accessToken || !session.user) {
      return createErrorResponse(401, 'NOT_AUTHENTICATED', 'Not authenticated');
    }

    const grantedScopes = new Set(
      (session.scope || '')
        .split(/\s+/)
        .map((scope) => scope.trim())
        .filter(Boolean)
    );

    const hasPlaylistModifyScope =
      grantedScopes.has('playlist-modify-private') || grantedScopes.has('playlist-modify-public');

    if (!hasPlaylistModifyScope) {
      return createErrorResponse(
        403,
        'INSUFFICIENT_SCOPE_RELOGIN',
        'Missing Spotify playlist permissions. Please logout and login again to renew scopes.',
        {
          requiredScopes: ['playlist-modify-private'],
          grantedScopes: Array.from(grantedScopes),
        }
      );
    }

    if (!session.user.id) {
      return createErrorResponse(400, 'MISSING_USER_ID', 'User ID not found in session');
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
      return createErrorResponse(400, 'MISSING_REQUIRED_FIELDS', 'Missing required fields', {
        required: ['name', 'trackUris'],
      });
    }

    const playlist = await createPlaylist(
      accessToken,
      session.user.id,
      name,
      description || 'Created with RollPlay'
    );

    messages.push('Playlist criada com sucesso.');

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await getPlaylistDetails(accessToken, playlist.id);
    } catch (verifyError) {
      console.error('Failed to verify playlist details:', verifyError);
    }

    try {
      await addTracksToPlaylist(accessToken, playlist.id, trackUris);
      messages.push(`${trackUris.length} músicas adicionadas à playlist.`);
    } catch (addError: any) {
      const msg = String(addError?.message || '');

      if (msg.includes('401')) {
        const newToken = await refreshSessionTokenIfPossible();

        if (!newToken) {
          throw addError;
        }

        accessToken = newToken;
        await addTracksToPlaylist(newToken, playlist.id, trackUris);
        messages.push(`${trackUris.length} músicas adicionadas à playlist.`);
      } else {
        throw addError;
      }
    }

    const warnings: string[] = [];

    if (grantedScopes.has('ugc-image-upload')) {
      try {
        const imagePath = join(process.cwd(), 'public', 'img_capa.png');
        const imageBuffer = readFileSync(imagePath);
        const jpegBuffer = await ensureSpotifyCompatibleJpeg(imageBuffer);

        await uploadPlaylistImage(accessToken, playlist.id, jpegBuffer);
        messages.push('Capa da playlist enviada com sucesso.');
      } catch (imageError: any) {
        warnings.push(`Falha ao enviar capa da playlist: ${imageError.message}`);
      }
    } else {
      warnings.push(
        'Capa não enviada: faltou o escopo ugc-image-upload. Faça login novamente para permitir upload de capa.'
      );
    }

    return NextResponse.json({
      spotifyPlaylistUrl: playlist.url,
      playlistId: playlist.id,
      messages,
      warning: warnings.length > 0 ? warnings.join(' ') : undefined,
    });
  } catch (error: any) {
    console.error('Create playlist error:', error);
    return createErrorResponse(500, 'PLAYLIST_CREATION_FAILED', 'Failed to create playlist', {
      reason: error?.message || 'Unknown error',
    });
  }
}

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
