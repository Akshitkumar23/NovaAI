
'use server';

import { fetchPageContent } from './scraper';
import { runDiscovery } from '@/ai/flows/discovery-agent';

// High-quality sources for AI tool discovery
const SOURCES = [
  'https://www.futurepedia.io/',
  'https://www.producthunt.com/topics/artificial-intelligence',
  'https://theresanaiforthat.com/',
  'https://topai.tools/'
];

/**
 * The core engine that runs the automated discovery cycle.
 * It fetches content from multiple sources and uses AI to identify new tools.
 */
export async function performAutomatedScan() {
  console.log('--- Starting Automated 7 PM AI Tool Discovery ---');
  
  let allDiscoveredTools: any[] = [];

  for (const url of SOURCES) {
    try {
      console.log(`Scanning source: ${url}`);
      const { text, error } = await fetchPageContent(url);
      
      if (error || !text) {
        console.warn(`Skipping ${url} due to fetch error:`, error);
        continue;
      }

      const results = await runDiscovery({ rawText: text });
      if (results && results.foundTools && results.foundTools.length > 0) {
        console.log(`AI found ${results.foundTools.length} tools on ${url}`);
        allDiscoveredTools.push(...results.foundTools);
      }
    } catch (e) {
      console.error(`Unexpected error scanning ${url}:`, e);
    }
  }

  // Deduplicate tools by name (case-insensitive)
  const uniqueTools = Array.from(
    new Map(allDiscoveredTools.map(item => [item.name.toLowerCase(), item])).values()
  );

  console.log(`--- Scan Complete. Found ${uniqueTools.length} unique tools. ---`);

  return {
    timestamp: new Date().toISOString(),
    tools: uniqueTools
  };
}
