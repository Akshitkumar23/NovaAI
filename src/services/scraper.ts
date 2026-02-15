
'use server';

import { parse } from 'node-html-parser';

/**
 * A service to fetch and clean HTML content from a URL.
 * Optimized with realistic headers to avoid blocks.
 */
export async function fetchPageContent(url: string): Promise<{ text: string; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      return { text: '', error: `Failed to fetch: ${response.statusText} (${response.status})` };
    }

    const html = await response.text();
    const root = parse(html);

    // Remove unwanted elements to save tokens and clean data
    root.querySelectorAll('script, style, noscript, svg, footer, header, nav, iframe, ad, .ads, #ads').forEach(el => el.remove());

    // Extract text content and clean whitespace
    const text = root.innerText
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    // Send a substantial chunk to AI for analysis
    return { text: text.slice(0, 12000) }; 
  } catch (e: any) {
    console.error(`Scraper error for ${url}:`, e.message);
    return { text: '', error: e.message };
  }
}
