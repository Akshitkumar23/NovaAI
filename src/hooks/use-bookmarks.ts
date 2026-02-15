"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const BOOKMARKS_KEY = 'toolnext_bookmarks';

const getBookmarks = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const item = window.localStorage.getItem(BOOKMARKS_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.warn('Error reading bookmarks from localStorage', error);
    return [];
  }
};

export const useBookmarks = (toolId?: string) => {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const saveBookmarks = (newBookmarks: string[]) => {
    try {
      setBookmarks(newBookmarks);
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.warn('Error saving bookmarks to localStorage', error);
    }
  };

  const addBookmark = (id: string) => {
    const newBookmarks = [...bookmarks, id];
    saveBookmarks(newBookmarks);
    toast({ title: 'Bookmarked!', description: 'Tool added to your bookmarks.' });
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter((b) => b !== id);
    saveBookmarks(newBookmarks);
    toast({ title: 'Bookmark removed.', description: 'Tool removed from your bookmarks.' });
  };
  
  const isBookmarked = toolId ? bookmarks.includes(toolId) : false;

  const toggleBookmark = useCallback(() => {
    if (!toolId) return;
    if (isBookmarked) {
      removeBookmark(toolId);
    } else {
      addBookmark(toolId);
    }
  }, [toolId, isBookmarked, bookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, addBookmark, removeBookmark };
};
