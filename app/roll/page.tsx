'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Dice3D from '@/components/Dice3D';
import { genres } from '@/lib/genres';
import { getDiceFaces } from '@/lib/dice';

export default function RollPage() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [diceFaces, setDiceFaces] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);

  useEffect(() => {
    setDiceFaces(getDiceFaces(selectedGenres.length));
  }, [selectedGenres]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < 6) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRoll = () => {
    if (selectedGenres.length === 0) return;
    setRollResult(null);
    setIsRolling(true);
  };

  const handleRollComplete = (value: number) => {
    setRollResult(value);
    setIsRolling(false);
    
    // Navigate to result page after a short delay
    setTimeout(() => {
      const params = new URLSearchParams({
        mode: 'roll',
        genres: selectedGenres.join(','),
        rollValue: value.toString(),
        diceFaces: diceFaces.toString(),
      });
      router.push(`/result?${params.toString()}`);
    }, 1500);
  };

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-hero mb-2">
            Dice Roll
          </h1>
          <p className="text-text-secondary">
            Selecione até 6 gêneros e role o dado
          </p>
        </div>

        {/* Dice Display */}
        <Card variant="surface-2" className="mb-8">
          <div className="text-center mb-4">
            <p className="text-text-muted text-sm mb-2">
              {selectedGenres.length === 0 ? 'Selecione gêneros para começar' : `Dado atual: D${diceFaces}`}
            </p>
            <div className="text-neon-magenta font-bold text-2xl">
              {selectedGenres.length} gênero{selectedGenres.length !== 1 ? 's' : ''} selecionado{selectedGenres.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <Dice3D 
            faces={diceFaces} 
            onRollComplete={handleRollComplete}
            isRolling={isRolling}
          />
        </Card>

        {/* Genre Selection */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Selecione os gêneros (máximo 6)
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 6}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGenres.includes(genre)
                    ? 'bg-neon-violet text-bg-main shadow-glow-primary'
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-1 hover:text-text-primary'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {genre}
              </button>
            ))}
          </div>
        </Card>

        {/* Roll Button */}
        <Button
          variant="secondary"
          onClick={handleRoll}
          disabled={selectedGenres.length === 0 || isRolling}
          className="w-full text-lg py-4"
        >
          {isRolling ? 'Rolando...' : `Rolar D${diceFaces}`}
        </Button>
      </div>
    </div>
  );
}
