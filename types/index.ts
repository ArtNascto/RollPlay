// Track data structure
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  previewUrl: string | null;
  spotifyUrl: string;
  uri: string;
}

// Session data structure
export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: {
    id: string;
    email: string;
    displayName: string;
  };
}

// Mood profile from AI
export interface MoodProfile {
  searchKeywords: string[];
  playlistName: string;
  playlistDescription: string;
  extraHints?: string[];
}

// Seed info for generation
export interface SeedInfo {
  queries: string[];
  totalResults: number;
}

// Mood definition
export interface Mood {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  fallbackKeywords: string[];
}

// Country definition
export interface Country {
  name: string;
  code: string;
  emoji: string;
}

// Generation request params
export interface GenerationParams {
  mode: 'roll' | 'country' | 'mood';
  genres?: string[];
  country?: string;
  mood?: string;
  rollValue?: number;
  diceFaces?: number;
}

// Generation response
export interface GenerationResponse {
  tracks: Track[];
  playlistName: string;
  playlistDescription: string;
  seedInfo: SeedInfo;
}
