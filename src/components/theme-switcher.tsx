'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sun, Moon, Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('toolnext-theme') || 'dark';
    document.documentElement.className = savedTheme;
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('toolnext-theme', newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
           Orange (Default)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('theme-blue')}>
           Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('theme-green')}>
           Green
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
