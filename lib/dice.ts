// Calculate dice faces based on genre count
/**
 * Determina o número de faces do dado baseado na quantidade de gêneros selecionados
 * Lógica: Quanto mais gêneros, maior o dado para distribuir proporcionalmente
 * 
 * Mapeamento:
 * - 1-3 gêneros  → D3  (cada gênero pode ter 1 face)
 * - 4-6 gêneros  → D6  (cada gênero pode ter 1 face)
 * - 7-8 gêneros  → D8  (cada gênero pode ter 1 face)
 * - 9-12 gêneros → D12 (cada gênero pode ter 1 face)
 * - 13-20 gêneros → D20 (cada gênero pode ter 1 face)
 */
export function getDiceFaces(genreCount: number): number {
  if (genreCount <= 0) return 3;
  if (genreCount <= 3) return 3;
  if (genreCount <= 6) return 6;
  if (genreCount <= 8) return 8;
  if (genreCount <= 12) return 12;
  return 20; // 13-20 genres
}

// Roll a dice with given faces
export function rollDice(faces: number): number {
  return Math.floor(Math.random() * faces) + 1;
}
