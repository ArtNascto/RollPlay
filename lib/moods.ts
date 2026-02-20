import { Mood } from '@/types';

export const moods: Mood[] = [
  {
    id: 'energetic',
    name: 'Energético',
    description: 'Músicas vibrantes e cheias de energia',
    icon: '⚡',
    color: '#FB7185', // pink-neon
    fallbackKeywords: ['upbeat', 'energetic', 'fast', 'party', 'dance'],
  },
  {
    id: 'melancholic',
    name: 'Melancólico',
    description: 'Para momentos introspectivos e emotivos',
    icon: '🌧️',
    color: '#8B5CF6', // neon-violet
    fallbackKeywords: ['melancholic', 'sad', 'emotional', 'slow', 'ballad'],
  },
  {
    id: 'relaxed',
    name: 'Relaxado',
    description: 'Sons calmos e tranquilos',
    icon: '🌊',
    color: '#22D3EE', // cyan-tech
    fallbackKeywords: ['chill', 'relaxed', 'calm', 'ambient', 'peaceful'],
  },
  {
    id: 'festive',
    name: 'Festivo',
    description: 'Celebração e alegria máxima',
    icon: '🎉',
    color: '#A855F7', // neon-magenta
    fallbackKeywords: ['party', 'celebration', 'festive', 'fun', 'happy'],
  },
  {
    id: 'focused',
    name: 'Focado',
    description: 'Ideal para trabalho e concentração',
    icon: '🎯',
    color: '#22D3EE', // cyan-tech
    fallbackKeywords: ['focus', 'study', 'work', 'concentration', 'instrumental'],
  },
  {
    id: 'romantic',
    name: 'Romântico',
    description: 'Para momentos especiais a dois',
    icon: '💜',
    color: '#C084FC', // neon-highlight
    fallbackKeywords: ['romantic', 'love', 'smooth', 'sensual', 'intimate'],
  },
];

export function getMoodById(id: string): Mood | undefined {
  return moods.find(m => m.id === id);
}
