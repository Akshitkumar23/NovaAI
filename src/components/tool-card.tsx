"use client";

import Image from "next/image";
import { Bookmark, Zap, ArrowUpRight } from "lucide-react";
import { useRouter } from 'next/navigation';

import { categories } from "@/lib/data";
import type { Tool } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";


interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks(tool.id);
  const category = categories.find(c => c.id === tool.category);
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    router.push(`/tools/${tool.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });
  }

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden glass-3d group relative cursor-pointer rounded-[2.5rem]"
      onClick={handleCardClick}
    >
       {/* 3D Inner Glow for Hover */}
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

       <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
            e.stopPropagation(); 
            toggleBookmark();
        }}
        aria-label="Bookmark tool"
        className="absolute top-6 right-6 z-20 glass h-10 w-10 rounded-xl hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
      >
        <Bookmark className={cn("h-5 w-5 transition-all", isBookmarked ? "fill-primary text-primary scale-110" : "text-muted-foreground")} />
      </Button>

      <div className="p-8 pb-4 relative z-10">
        <div className="flex items-start gap-5">
          <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-[1.5rem] border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Image 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              fill 
              className="object-cover" 
              unoptimized
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-headline text-xl group-hover:text-primary pr-8 transition-colors flex items-center gap-2 tracking-tight">
                {tool.name}
                {tool.pricing.isPriceReduced && <Zap className="w-3 h-3 text-green-400 fill-green-400 animate-pulse" />}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">{tool.description}</CardDescription>
          </div>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-4 px-8 pb-6 relative z-10">
        <div className="flex flex-wrap gap-2">
            {category && (
                <Badge variant="secondary" className="bg-primary/20 text-primary border-none font-bold text-[10px] uppercase tracking-wider px-3">{category.name}</Badge>
            )}
            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold border-white/10", tool.pricing.isPriceReduced ? "border-green-500/50 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : "bg-white/5")}>
                {tool.pricing.model}
            </Badge>
            {tool.noCode && <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-wider font-bold">No-Code</Badge>}
        </div>
      </CardContent>
      
      <CardFooter className="bg-white/5 px-8 py-5 mt-auto border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex flex-col text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">
          <span>Launched: {formatDate(tool.launchDate)}</span>
        </div>
        <div className="p-2 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300">
          <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </CardFooter>
    </Card>
  );
}