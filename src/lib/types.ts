
import type { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  logo: string;
  logo_hint?: string;
  link: string;
  screenshots: string[];
  screenshots_hint?: string;
  videoDemo?: string; // Idea 6: Video Walkthroughs
  launchDate: string;
  lastUpdated: string;
  isTrending: boolean;
  pricing: {
    model: "Free" | "Freemium" | "Paid" | "Free Trial";
    details: string;
    isPriceReduced?: boolean; // Idea 4: Price tracking
    lastPriceChange?: string;
  };
  features: string[];
  reviews: Review[];
  collections: string[];
  noCode: boolean;
  toolOfTheDay?: boolean;
}

export interface Review {
  author: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  source: string;
}
