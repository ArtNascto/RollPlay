import { Track } from '@/types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}

// Get current user profile
export async function getCurrentUser(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }

  return response.json();
}

// Search for tracks
export async function searchTracks(
  accessToken: string,
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<Track[]> {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${SPOTIFY_API_BASE}/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  const data = await response.json();
  
  return data.tracks.items.map((item: any) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(', '),
    album: item.album.name,
    imageUrl: item.album.images[0]?.url || '',
    previewUrl: item.preview_url,
    spotifyUrl: item.external_urls.spotify,
    uri: item.uri,
  }));
}

// Create playlist
export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string
): Promise<{ id: string; url: string }> {
  const response = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }

  const data = await response.json();
  return {
    id: data.id,
    url: data.external_urls.spotify,
  };
}

// Add tracks to playlist (max 100 at a time)
export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[]
): Promise<void> {
  if (!uris || uris.length === 0) {
    throw new Error('No tracks to add');
  }

  // Split into batches of 100 (Spotify limit)
  for (let i = 0; i < uris.length; i += 100) {
    const batch = uris.slice(i, i + 100);
    
    console.log(`Adding batch ${Math.floor(i/100) + 1}: ${batch.length} tracks to playlist ${playlistId}`);
    
    // Use /tracks endpoint (same as working Python code)
    const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: batch,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Failed to add tracks (HTTP ${response.status}):`, errorData);
      throw new Error(`Failed to add tracks to playlist: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Batch ${Math.floor(i/100) + 1} added successfully. Snapshot ID:`, result.snapshot_id);
  }
}
