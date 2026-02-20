// Calculate dice faces based on genre count
export function getDiceFaces(genreCount: number): number {
  if (genreCount <= 0) return 3;
  if (genreCount === 1) return 3;
  if (genreCount === 2) return 4;
  if (genreCount === 3) return 6;
  if (genreCount === 4) return 8;
  if (genreCount === 5) return 12;
  return 20; // 6 or more genres
}

// Roll a dice with given faces
export function rollDice(faces: number): number {
  return Math.floor(Math.random() * faces) + 1;
}
