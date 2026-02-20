'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { Track, GenerationResponse } from '@/types';
import Image from 'next/image';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  const params = {
    mode: searchParams.get('mode') as 'roll' | 'country' | 'mood',
    genres: searchParams.get('genres')?.split(',') || [],
    country: searchParams.get('country') || undefined,
    mood: searchParams.get('mood') || undefined,
    rollValue: searchParams.get('rollValue') ? parseInt(searchParams.get('rollValue')!) : undefined,
    diceFaces: searchParams.get('diceFaces') ? parseInt(searchParams.get('diceFaces')!) : undefined,
  };

  const fetchPlaylist = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/spotify/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }

      const data: GenerationResponse = await response.json();
      setResult(data);
      setTracks(data.tracks);
    } catch (err) {
      setError('Erro ao gerar playlist. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const handleRemoveTrack = (trackId: string) => {
    setTracks(tracks.filter(t => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
    }
  };

  const handleSaveToSpotify = async () => {
    if (!result || tracks.length === 0) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/spotify/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.playlistName,
          description: result.playlistDescription,
          trackUris: tracks.map(t => t.uri),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save playlist');
      }

      const data = await response.json();
      setPlaylistUrl(data.spotifyPlaylistUrl);
      setSaveSuccess(true);
    } catch (err) {
      alert('Erro ao salvar playlist no Spotify');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center px-4">
        <Card variant="surface-2" className="max-w-md w-full">
          <Loading />
          <p className="text-center text-text-secondary mt-4">
            Gerando sua playlist...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-full flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error || 'Erro desconhecido'} onRetry={fetchPlaylist} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card variant="surface-2" className="mb-6">
          <h1 className="text-3xl font-bold text-gradient-hero mb-2">
            {result.playlistName}
          </h1>
          <p className="text-text-secondary mb-4">
            {result.playlistDescription}
          </p>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <span>{tracks.length} músicas</span>
            <span>•</span>
            <span>{result.seedInfo.queries.length} consultas</span>
          </div>
        </Card>

        {/* Tracks List */}
        <Card className="mb-24">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Músicas
          </h2>
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-surface-2 rounded-lg p-4 hover:bg-bg-alt transition-all"
              >
                <div className="flex gap-4">
                  {/* Album Art */}
                  <div className="flex-shrink-0">
                    {track.imageUrl ? (
                      <Image
                        src={track.imageUrl}
                        alt={track.album}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-surface-1 rounded-md flex items-center justify-center">
                        🎵
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text-primary font-semibold truncate">
                      {track.title}
                    </h3>
                    <p className="text-text-secondary text-sm truncate">
                      {track.artist}
                    </p>
                    <p className="text-text-muted text-xs truncate">
                      {track.album}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {track.previewUrl ? (
                      <button
                        onClick={() => setCurrentTrack(track)}
                        className="px-3 py-1 bg-neon-violet text-bg-main text-sm rounded hover:shadow-glow-primary transition-all"
                      >
                        ▶️ Preview
                      </button>
                    ) : (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-cyan-tech text-bg-main text-sm rounded hover:shadow-glow-cyan transition-all text-center"
                      >
                        Spotify
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveTrack(track.id)}
                      className="px-3 py-1 bg-error text-white text-sm rounded hover:opacity-80 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audio Player */}
        {currentTrack && currentTrack.previewUrl && (
          <div className="fixed bottom-20 left-0 right-0 bg-surface-2 border-t border-border p-4 z-40">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button
                onClick={() => setCurrentTrack(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
              <div className="flex-1">
                <p className="text-text-primary font-medium text-sm truncate">
                  {currentTrack.title}
                </p>
                <audio
                  src={currentTrack.previewUrl}
                  controls
                  autoPlay
                  className="w-full mt-2"
                  style={{ height: '32px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="fixed bottom-16 left-0 right-0 bg-surface-2 border-t border-border p-4 z-40">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={fetchPlaylist}
              disabled={isLoading}
              className="flex-1"
            >
              🔄 Re-gerar
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveToSpotify}
              disabled={isSaving || tracks.length === 0 || saveSuccess}
              className="flex-1"
            >
              {isSaving ? '💾 Salvando...' : saveSuccess ? '✓ Salvo!' : '💾 Salvar no Spotify'}
            </Button>
          </div>
          
          {saveSuccess && playlistUrl && (
            <div className="mt-3 text-center">
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-neon text-sm hover:underline"
              >
                ✓ Playlist criada! Abrir no Spotify →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
