import { createHash } from 'crypto';

/**
 * Generates a signed token for Bunny.net video playback.
 * Typically used for securing embeds from iframe.mediadelivery.net.
 * 
 * Formula: sha256(TokenKey + VideoID + ExpirationTimestamp)
 */
export function generateBunnySignedUrl(
  libraryId: string,
  videoId: string,
  expirationSeconds: number = 900 // 15 minutes default
): { token: string; expires: number; embedUrl: string } {
  const tokenKey = process.env.BUNNY_TOKEN_KEY;
  if (!tokenKey) {
    throw new Error('BUNNY_TOKEN_KEY is not set');
  }

  const expires = Math.floor(Date.now() / 1000) + expirationSeconds;
  
  // Format for Bunny.net video streaming embed path
  // Usually, signature is generated on: tokenKey + videoId + expires
  const hashInput = tokenKey + videoId + expires;
  const token = createHash('sha256').update(hashInput).digest('hex');

  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}`;

  return {
    token,
    expires,
    embedUrl,
  };
}
