'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { moods } from '@/lib/moods';
import type { Mood, MoodProfile } from '@/types';

export default function MoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moodProfile, setMoodProfile] = useState<MoodProfile | null>(null);

  const handleSelectMood = async (mood: Mood) => {
    setSelectedMood(mood);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/mood-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood.id }),
      });
      
      if (response.ok) {
        const profile = await response.json();
        setMoodProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch mood profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!selectedMood) return;
    
    const params = new URLSearchParams({
      mode: 'mood',
      mood: selectedMood.id,
    });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-hero mb-2">
            Descoberta por Mood
          </h1>
          <p className="text-text-secondary">
            Como você está se sentindo hoje?
          </p>
        </div>

        {/* Mood Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {moods.map((mood) => (
            <Card
              key={mood.id}
              hover
              onClick={() => handleSelectMood(mood)}
              className={`cursor-pointer transition-all ${
                selectedMood?.id === mood.id
                  ? 'border-2 shadow-glow-primary'
                  : ''
              }`}
              style={selectedMood?.id === mood.id ? {
                borderColor: mood.color,
                boxShadow: `0 0 24px ${mood.color}40`,
              } : {}}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{mood.icon}</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {mood.name}
                </h3>
                <p className="text-text-secondary text-sm">
                  {mood.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Loading or Profile Preview */}
        {isLoading && (
          <Card variant="surface-2" className="mb-8">
            <Loading />
            <p className="text-center text-text-muted mt-4">
              Gerando perfil musical...
            </p>
          </Card>
        )}

        {moodProfile && !isLoading && (
          <Card variant="surface-2" className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Perfil Musical
            </h3>
            <div className="space-y-2">
              <p className="text-text-secondary">
                <span className="text-text-muted">Playlist:</span>{' '}
                <span className="text-neon-highlight font-medium">
                  {moodProfile.playlistName}
                </span>
              </p>
              <p className="text-text-secondary text-sm">
                {moodProfile.playlistDescription}
              </p>
              {moodProfile.extraHints && moodProfile.extraHints.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {moodProfile.extraHints.map((hint, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-surface-1 text-cyan-tech text-xs rounded-full"
                    >
                      {hint}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!selectedMood || isLoading}
          className="w-full text-lg py-4"
        >
          Gerar Playlist
        </Button>
      </div>
    </div>
  );
}
