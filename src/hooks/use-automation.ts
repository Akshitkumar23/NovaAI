
'use client';

import { useState, useEffect } from 'react';
import { performAutomatedScan } from '@/services/auto-discovery';

const LAST_SCAN_KEY = 'toolnext_last_scan_date';
const AUTOMATED_TOOLS_KEY = 'toolnext_automated_tools';

export function useAutomation() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [discoveredTools, setDiscoveredTools] = useState<any[]>([]);

  useEffect(() => {
    // Initial load from local storage
    const savedDate = localStorage.getItem(LAST_SCAN_KEY);
    const savedTools = localStorage.getItem(AUTOMATED_TOOLS_KEY);
    
    setLastScan(savedDate);
    if (savedTools) {
      try {
        setDiscoveredTools(JSON.parse(savedTools));
      } catch (e) {
        console.error("Failed to parse saved tools", e);
      }
    }

    // Check if it's time to run automation
    checkAndRunAutomation();
  }, []);

  const checkAndRunAutomation = async () => {
    if (typeof window === 'undefined') return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentHour = now.getHours();
    const lastScanDate = localStorage.getItem(LAST_SCAN_KEY);

    // TRIGGER LOGIC: 
    // 1. Current time is 7 PM (19:00) or later
    // 2. We haven't successfully scanned today
    if (currentHour >= 19 && lastScanDate !== today) {
      console.log("Triggering 7 PM Automated Scan...");
      triggerScan(today);
    }
  };

  const triggerScan = async (dateStr: string) => {
    if (isScanning) return;
    
    setIsScanning(true);
    try {
      const results = await performAutomatedScan();
      
      // Process discovered tools to match our high-quality UI structure
      const processed = results.tools.map((t: any) => {
        const firstLetter = t.name.charAt(0).toUpperCase();
        const secondLetter = t.name.length > 1 ? t.name.charAt(1).toUpperCase() : '';
        const initials = `${firstLetter}${secondLetter}`;
        
        return {
          ...t,
          id: `auto-${t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
          // Consistent Text Logo Style
          logo: `https://placehold.co/400x400/orange/white.png?text=${initials}`,
          screenshots: [`https://placehold.co/1200x800/333/white.png?text=${encodeURIComponent(t.name)}+Screenshot`],
          launchDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          isTrending: true,
          pricing: { 
            model: 'Free Trial', 
            details: 'Pricing details available on the official website.' 
          },
          features: ['AI Discovered', 'Fresh Tool', t.reason || 'Auto-categorized'],
          reviews: [],
          collections: [],
          noCode: true,
          longDescription: t.reason ? `${t.description} Reason for discovery: ${t.reason}` : t.description
        };
      });

      // Update Local Database
      const existing = JSON.parse(localStorage.getItem(AUTOMATED_TOOLS_KEY) || '[]');
      
      // Filter out tools we already have
      const newOnly = processed.filter(p => !existing.some((e: any) => e.name.toLowerCase() === p.name.toLowerCase()));
      const updated = [...newOnly, ...existing].slice(0, 100); // Keep last 100 tools
      
      localStorage.setItem(AUTOMATED_TOOLS_KEY, JSON.stringify(updated));
      localStorage.setItem(LAST_SCAN_KEY, dateStr);
      
      setDiscoveredTools(updated);
      setLastScan(dateStr);
      console.log(`Scan successful. Added ${newOnly.length} new tools.`);
    } catch (e) {
      console.error('7 PM Automation failed:', e);
    } finally {
      setIsScanning(false);
    }
  };

  return { isScanning, lastScan, discoveredTools };
}
