
'use server';

import { parse } from 'node-html-parser';

export async function fetchUrlContent(url: string): Promise<{ textContent?: string, error?: string }> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            return { error: `Failed to fetch URL: ${response.status} ${response.statusText}` };
        }

        const html = await response.text();
        const root = parse(html);

        // Remove script and style tags to clean up the content
        root.querySelectorAll('script, style, noscript, svg, footer, header, nav').forEach(node => node.remove());
        
        // Select the body or the whole document if body is not present
        const mainContent = root.querySelector('body') || root;
        
        // Get text content, replacing multiple newlines/spaces with a single space
        const textContent = mainContent.innerText.replace(/\s\s+/g, ' ').trim();

        return { textContent };
    } catch (e: any) {
        console.error(`Error fetching URL content for ${url}:`, e);
        return { error: e.message || 'An unknown error occurred while fetching the URL.' };
    }
}
