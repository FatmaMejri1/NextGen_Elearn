/** Extract an 11-char YouTube video id from a URL or raw id (supports Shorts). */
export function extractYouTubeVideoId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';

  const match = trimmed.match(
    /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})|^([\w-]{11})$/,
  );
  if (match) return match[1] ?? match[2] ?? '';

  return trimmed;
}
