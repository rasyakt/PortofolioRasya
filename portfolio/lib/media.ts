/** True for PDF file URLs (rendered as document tiles, not images). */
export function isPdfUrl(url: string): boolean {
  return /\.pdf($|\?|#)/i.test(url);
}
