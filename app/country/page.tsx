'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { countries, getRandomCountry } from '@/lib/countries';
import type { Country } from '@/types';

export default function CountryPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRandom, setIsRandom] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRandomCountry = () => {
    const random = getRandomCountry();
    setSelectedCountry(random);
    setIsRandom(true);
    setSearchQuery('');
  };

  const handleDiscover = () => {
    if (!selectedCountry) return;
    
    const params = new URLSearchParams({
      mode: 'country',
      country: selectedCountry.name,
    });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-tech mb-2">
            Descoberta por País
          </h1>
          <p className="text-text-secondary">
            Explore músicas de diferentes culturas
          </p>
        </div>

        {/* Random Country Toggle */}
        <Card variant="surface-2" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                País Aleatório
              </h3>
              <p className="text-text-muted text-sm">
                Deixe a sorte escolher por você
              </p>
            </div>
            <Button
              variant={isRandom ? 'primary' : 'outline'}
              onClick={handleRandomCountry}
              className="shadow-glow-magenta"
            >
              🎲 Sortear
            </Button>
          </div>
          
          {isRandom && selectedCountry && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-5xl mb-2">{selectedCountry.emoji}</div>
                <div className="text-2xl font-bold text-neon-magenta">
                  {selectedCountry.name}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Search */}
        {!isRandom && (
          <Card className="mb-6">
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-neon-violet focus:shadow-glow-primary focus:outline-none transition-all"
            />
          </Card>
        )}

        {/* Country List */}
        {!isRandom && (
          <Card className="mb-8 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country);
                    setIsRandom(false);
                  }}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedCountry?.code === country.code
                      ? 'bg-neon-violet text-bg-main shadow-glow-primary'
                      : 'bg-surface-2 text-text-primary hover:bg-surface-1'
                  }`}
                >
                  <div className="text-3xl mb-2">{country.emoji}</div>
                  <div className="text-sm font-medium">{country.name}</div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Discover Button */}
        <Button
          variant="secondary"
          onClick={handleDiscover}
          disabled={!selectedCountry}
          className="w-full text-lg py-4"
        >
          Descobrir Músicas {selectedCountry && `de ${selectedCountry.name}`}
        </Button>
      </div>
    </div>
  );
}
