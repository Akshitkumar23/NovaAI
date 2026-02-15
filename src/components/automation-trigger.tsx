
'use client';

import { useAutomation } from '@/hooks/use-automation';
import { Loader2, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * A silent component that manages the 7 PM automation trigger.
 */
export function AutomationTrigger() {
  const { isScanning, lastScan } = useAutomation();
  const [showNotification, setShowAutomationStatus] = useState(false);

  useEffect(() => {
    if (isScanning) {
      setShowAutomationStatus(true);
      const timer = setTimeout(() => setShowAutomationStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  if (!showNotification && !isScanning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-white/20">
        {isScanning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <div className="text-sm">
              <p className="font-bold">7 PM Automated Scan Active</p>
              <p className="opacity-80 text-xs">AI is searching for new tools...</p>
            </div>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-current" />
            <div className="text-sm">
              <p className="font-bold">Scan Complete</p>
              <p className="opacity-80 text-xs">New tools added to directory.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
