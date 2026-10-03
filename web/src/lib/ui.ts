/** Pick a readable text color (dark or white) for a solid background hex.
 *  This is why the amber MAAKO button needs dark text while the blue ones
 *  keep white — white-on-amber is too low-contrast. */
export function readableText(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Perceived luminance (sRGB weights).
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#1b1300' : '#ffffff';
}
