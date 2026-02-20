import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken, searchTracks } from '@/lib/spotify';
import { GenerationParams, Track } from '@/types';
import { getMoodById } from '@/lib/moods';

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
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const params: GenerationParams = await request.json();
    const { mode, genres = [], country, mood, rollValue, diceFaces } = params;

    // Build search queries
    const queries: string[] = [];
    
    if (mode === 'roll' && genres.length > 0) {
      /**
       * Dice roll mode: Map dice result to genre distribution
       * 
       * Logic:
       * - Divide dice faces among selected genres proportionally
       * - rollValue determines which genre(s) to prioritize
       * - Example: 6 genres on D12 → each genre gets 2 faces
       *   rollValue=5 → face 5 → 3rd genre (faces 5-6)
       */
      
      const varietyKeywords = ['new', 'popular', 'best', 'top', 'trending'];
      const exoticKeywords = ['underground', 'experimental', 'rare', 'unique', 'obscure'];
      
      // Determine exoticism based on roll value
      const isExotic = rollValue && diceFaces && rollValue > diceFaces * 0.7;
      const keywords = isExotic ? exoticKeywords : varietyKeywords;
      
      // Map rollValue to genre index
      let priorityGenreIndex = 0;
      if (rollValue && diceFaces && genres.length > 0) {
        // Calculate faces per genre
        const facesPerGenre = diceFaces / genres.length;
        // Determine which genre this roll corresponds to
        priorityGenreIndex = Math.min(
          Math.floor((rollValue - 1) / facesPerGenre),
          genres.length - 1
        );
      }
      
      // Build queries prioritizing the selected genre
      const priorityGenre = genres[priorityGenreIndex];
      const otherGenres = genres.filter((_, i) => i !== priorityGenreIndex);
      
      // Priority genre gets 60% of queries (3 out of 5)
      queries.push(priorityGenre);
      queries.push(`${priorityGenre} ${keywords[Math.floor(Math.random() * keywords.length)]}`);
      queries.push(`${priorityGenre} ${keywords[Math.floor(Math.random() * keywords.length)]}`);
      
      // Other genres get remaining queries (2 out of 5)
      if (otherGenres.length > 0) {
        const secondaryGenre = otherGenres[Math.floor(Math.random() * otherGenres.length)];
        queries.push(secondaryGenre);
        
        if (otherGenres.length > 1) {
          const tertiaryGenre = otherGenres.find(g => g !== secondaryGenre) || secondaryGenre;
          queries.push(`${tertiaryGenre} ${keywords[Math.floor(Math.random() * keywords.length)]}`);
        } else {
          queries.push(`${secondaryGenre} ${keywords[Math.floor(Math.random() * keywords.length)]}`);
        }
      } else {
        // If only one genre, add more variations
        queries.push(`${priorityGenre} best`);
        queries.push(`${priorityGenre} new`);
      }
    } else if (mode === 'country' && country) {
      // Country mode: search by country name and music terms
      queries.push(`${country} music`);
      queries.push(`${country} artist`);
      queries.push(`${country} traditional`);
      if (genres.length > 0) {
        queries.push(`${country} ${genres[0]}`);
      }
    } else if (mode === 'mood' && mood) {
      // Mood mode: use mood keywords
      const moodData = getMoodById(mood);
      if (moodData) {
        moodData.fallbackKeywords.forEach(keyword => {
          queries.push(keyword);
          if (genres.length > 0) {
            queries.push(`${genres[0]} ${keyword}`);
          }
        });
      }
    }

    // If no queries, add generic ones
    if (queries.length === 0) {
      queries.push('popular music');
      queries.push('trending songs');
    }

    // Fetch tracks from multiple queries
    const allTracks: Track[] = [];
    const seenIds = new Set<string>();

    for (const query of queries.slice(0, 5)) {
      try {
        // Fetch multiple pages (limit 10 per page due to Spotify 2026 limit)
        for (let offset = 0; offset < 30; offset += 10) {
          const tracks = await searchTracks(accessToken, query, 10, offset);
          
          // Add unique tracks
          tracks.forEach(track => {
            if (!seenIds.has(track.id)) {
              seenIds.add(track.id);
              allTracks.push(track);
            }
          });

          // Stop if we have enough tracks
          if (allTracks.length >= 40) break;
        }
        
        if (allTracks.length >= 40) break;
      } catch (error) {
        console.error(`Search error for query "${query}":`, error);
      }
    }

    // Generate playlist name and description
    let playlistName = 'RollPlay Discovery';
    let playlistDescription = 'Discovered with RollPlay';

    if (mode === 'roll' && diceFaces) {
      playlistName = `D${diceFaces} Roll ${rollValue ? `(${rollValue})` : ''} - ${genres.slice(0, 2).join(' + ')}`;
      playlistDescription = `Rolled a D${diceFaces} and got ${rollValue}! Exploring ${genres.join(', ')}`;
    } else if (mode === 'country' && country) {
      playlistName = `${country} Discovery`;
      playlistDescription = `Musical journey through ${country}`;
    } else if (mode === 'mood' && mood) {
      const moodData = getMoodById(mood);
      playlistName = `${moodData?.name || mood} Vibes`;
      playlistDescription = `${moodData?.description || 'Mood-based discovery'}`;
    }

    return NextResponse.json({
      tracks: allTracks.slice(0, 40),
      playlistName,
      playlistDescription,
      seedInfo: {
        queries: queries.slice(0, 5),
        totalResults: allTracks.length,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}
