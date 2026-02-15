
'use client';

import Link from "next/link";
import { categories, tools as staticTools, aiNews } from "@/lib/data";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Newspaper, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const [allTools, setAllTools] = useState<Tool[]>(staticTools);
  
  useEffect(() => {
    const saved = localStorage.getItem('toolnext_automated_tools');
    if (saved) {
      const discovered = JSON.parse(saved).map((t: any) => ({
        ...t,
        id: `auto-${t.name.toLowerCase().replace(/\s+/g, '-')}`
      }));
      setAllTools([...staticTools, ...discovered]);
    }
  }, []);

  const trendingTools = allTools.filter(t => t.isTrending).slice(0, 6);
  const toolOfTheDay = allTools.find(t => t.toolOfTheDay) || allTools[0];
  const latestNews = aiNews.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12 space-y-24">
      {/* 3D Glass Hero Section */}
      <section className="relative text-center py-20 md:py-36 overflow-hidden rounded-[3.5rem] bg-accent/10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          {/* 3D Floating Blobs */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="relative z-10 space-y-10 px-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] animate-float shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4" /> Exploring 40+ Top AI Tools
          </div>
          <h1 className="text-4xl md:text-8xl font-bold font-headline mb-4 leading-tight tracking-tighter">
            Build the Future <br className="hidden md:block" /> with <span className="shimmer-text">NovaAI</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed opacity-80">
            The ultimate 3D directory to explore, compare, and master the world's most powerful AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Button asChild size="lg" className="rounded-2xl px-12 h-16 text-lg shadow-2xl shadow-primary/30 hover:scale-105 hover:-translate-y-1 transition-all">
              <Link href="/categories">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl px-12 h-16 text-lg glass-primary hover:bg-primary/20 hover:-translate-y-1 transition-all">
              <Link href="/recommend" className="flex items-center gap-2">AI Recommendation <Sparkles className="h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-24">
            {/* Tool of the Day with 3D Card */}
            <section className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 flex items-center gap-3">
                    <Sparkles className="text-primary h-8 w-8" /> Tool of the Day
                </h2>
                <Card className="overflow-hidden glass-3d rounded-[3rem] border-white/10">
                    <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative aspect-video md:aspect-auto overflow-hidden">
                        <Link href={`/tools/${toolOfTheDay.id}`}>
                            <Image
                            src={toolOfTheDay.screenshots[0]}
                            alt={toolOfTheDay.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            unoptimized
                            />
                        </Link>
                        <div className="absolute inset-0 bg-gradient-to-r from-background/90 md:from-transparent to-transparent pointer-events-none"></div>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center space-y-8">
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                            <Image src={toolOfTheDay.logo} alt={toolOfTheDay.name} fill className="object-cover" unoptimized />
                          </div>
                          <div>
                              <CardTitle className="text-3xl md:text-5xl font-headline group-hover:text-primary transition-colors tracking-tighter">
                              <Link href={`/tools/${toolOfTheDay.id}`}>{toolOfTheDay.name}</Link>
                              </CardTitle>
                              <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 px-3">{toolOfTheDay.pricing.model}</Badge>
                          </div>
                        </div>
                        <p className="text-xl text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {toolOfTheDay.description}
                        </p>
                        <Button asChild size="lg" className="w-full sm:w-fit rounded-2xl px-10 h-14 shadow-xl shadow-primary/20">
                          <Link href={`/tools/${toolOfTheDay.id}`}>View Details <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </div>
                    </div>
                </Card>
            </section>

            {/* Trending Tools Grid */}
            <section className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold font-headline tracking-tight">Trending Now</h2>
                  <Link href="/categories" className="text-sm font-bold text-primary hover:tracking-widest transition-all flex items-center gap-2 group">
                      Browse All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {trendingTools.map((tool, idx) => (
                    <div key={tool.id} className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", `delay-[${idx * 100}ms]`)}>
                      <ToolCard tool={tool} />
                    </div>
                ))}
                </div>
            </section>
        </div>

        {/* Sidebar: News & Alerts with Glass style */}
        <aside className="space-y-12 animate-in slide-in-from-right-8 duration-700 delay-300">
            <section className="glass p-8 rounded-[2.5rem] space-y-8 border-white/10">
                <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-primary" /> AI Headlines
                </h2>
                <div className="space-y-8">
                    {latestNews.map((news) => (
                        <div key={news.id} className="group cursor-pointer space-y-3">
                            <Link href="/news">
                                <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.2em] bg-primary/10 text-primary border-none px-3 font-bold">{news.source}</Badge>
                                <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-tight tracking-tight">{news.title}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                  <TrendingUp className="h-3 w-3" /> {new Date(news.date).toLocaleDateString()}
                                </p>
                            </Link>
                        </div>
                    ))}
                    <Button asChild variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/5 rounded-xl font-bold">
                        <Link href="/news">Read Full Feed <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </section>

            <section className="glass-primary p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary fill-primary" /> Price Alerts
                </h2>
                <div className="space-y-6">
                    {allTools.filter(t => t.pricing.isPriceReduced).slice(0, 3).map(t => (
                        <Link key={t.id} href={`/tools/${t.id}`} className="flex items-center gap-4 group/item p-2 rounded-2xl hover:bg-white/5 transition-colors">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover/item:scale-110 transition-transform duration-500">
                              <Image src={t.logo} alt={t.name} fill className="object-cover" unoptimized />
                            </div>
                            <div>
                                <p className="text-sm font-bold group-hover/item:text-primary transition-colors">{t.name}</p>
                                <p className="text-[10px] text-green-400 font-bold uppercase tracking-[0.1em]">Save on Pro Plan</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
      </div>

      {/* 3D Categories Grid */}
      <section className="py-24 animate-in slide-in-from-bottom-12 duration-1000">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">Browse Categories</h2>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto font-light leading-relaxed">
            Find the perfect specialized tool to amplify your workflow.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          {categories.map((category, idx) => {
            const toolCount = allTools.filter(t => t.category === category.id).length;
            return (
              <Link key={category.id} href={`/categories/${category.id}`} className={cn("animate-in fade-in zoom-in-95 duration-500", `delay-[${idx * 50}ms]`)}>
                <Card className="h-full glass-3d hover:bg-primary/5 p-8 md:p-10 rounded-[3rem] relative overflow-hidden group">
                  <Badge variant="secondary" className="absolute top-6 right-6 opacity-40 text-[10px] bg-white/10 border-none px-3">{toolCount} Tools</Badge>
                  <div className="flex flex-col items-center md:items-start gap-6">
                    <div className="p-5 rounded-[1.5rem] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:rotate-[360deg] shadow-xl shadow-primary/10">
                      <category.icon className="w-10 h-10" />
                    </div>
                    <div className="text-center md:text-left space-y-3">
                      <h3 className="font-bold text-2xl font-headline tracking-tighter group-hover:text-primary transition-colors">{category.name}</h3>
                      <p className="hidden md:block text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light opacity-60">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  );
}
