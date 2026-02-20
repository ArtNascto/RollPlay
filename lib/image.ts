import sharp from 'sharp';

const SPOTIFY_IMAGE_MAX_BYTES = 256 * 1024;

type SpotifyJpegOptions = {
  maxBytes?: number;
};

async function toJpegBuffer(
  inputBuffer: Buffer,
  quality: number,
  width?: number,
  height?: number
): Promise<Buffer> {
  const pipeline = sharp(inputBuffer).rotate();

  if (width && height) {
    pipeline.resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
}

export async function ensureSpotifyCompatibleJpeg(
  inputBuffer: Buffer,
  options: SpotifyJpegOptions = {}
): Promise<Buffer> {
  const maxBytes = options.maxBytes ?? SPOTIFY_IMAGE_MAX_BYTES;
  const metadata = await sharp(inputBuffer).metadata();

  let width = metadata.width;
  let height = metadata.height;
  let quality = 90;

  let output = await toJpegBuffer(inputBuffer, quality, width, height);

  while (output.length > maxBytes && quality > 40) {
    quality -= 10;
    output = await toJpegBuffer(inputBuffer, quality, width, height);
  }

  while (output.length > maxBytes && width && height && width > 300 && height > 300) {
    width = Math.floor(width * 0.9);
    height = Math.floor(height * 0.9);
    output = await toJpegBuffer(inputBuffer, quality, width, height);
  }

  if (output.length > maxBytes) {
    throw new Error(`Could not reduce image below ${Math.round(maxBytes / 1024)}KB`);
  }

  return output;
}

export { SPOTIFY_IMAGE_MAX_BYTES };
