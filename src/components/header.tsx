
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Home, Compass, GitCompareArrows, Sparkles, Calendar, Bookmark, User, Globe, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Compass },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/recommend", label: "Recommend", icon: Sparkles },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/discovery", label: "Discovery", icon: Globe },
  { href: "/foryou", label: "For You", icon: User },
  { href: "/launches", label: "Launches", icon: Calendar },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "h-16 bg-background/70 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
        : "h-20 bg-transparent border-b border-transparent"
    )}>
      <div className="container flex h-full items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] glass border-white/10 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="p-6">
                <Link href="/" className="flex items-center space-x-2 mb-10" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-8 w-8" />
                  <span className="font-bold font-headline text-xl tracking-tight">NovaAI</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                         pathname === item.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl tracking-tighter">Nova<span className="text-primary">AI</span></span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          {mainNav.slice(0, 6).map((item) => (
            <Button 
              key={item.href} 
              variant="ghost" 
              size="sm" 
              asChild 
              className={cn(
                "rounded-full px-4 font-medium transition-all duration-300",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form action="/search" className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              type="search"
              name="q"
              placeholder="Quick search..."
              className="pl-10 w-[140px] lg:w-[220px] h-10 glass border-white/5 rounded-full focus:ring-primary/20 transition-all focus:w-[180px] lg:focus:w-[280px]"
            />
          </form>
          <Button variant="ghost" size="icon" className="sm:hidden rounded-full glass border-white/5" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
