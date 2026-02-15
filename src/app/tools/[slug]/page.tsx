
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tools, categories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Calendar, RefreshCw, Youtube } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ReviewSection } from './review-section';
import { BackButton } from "@/components/back-button";

export function generateStaticParams() {
    return tools.map((tool) => ({
      slug: tool.id,
    }))
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(p => p.id === slug);

  if (!tool) {
    notFound();
  }

  const category = categories.find(c => c.id === tool.category);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Image src={tool.logo} alt={`${tool.name} logo`} width={64} height={64} className="rounded-xl border" data-ai-hint={tool.logo_hint || "logo"} />
                        <div>
                            <h1 className="text-4xl font-bold font-headline">{tool.name}</h1>
                            <p className="text-xl text-muted-foreground">{tool.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        {category && <Badge variant="secondary">{category.name}</Badge>}
                        <Badge variant="outline">{tool.pricing.model}</Badge>
                        {tool.pricing.isPriceReduced && <Badge variant="default" className="bg-green-600">Price Alert: Discounted</Badge>}
                        {tool.noCode && <Badge variant="outline">No-Code</Badge>}
                        <Button asChild variant="link" size="sm">
                            <a href={tool.link} target="_blank" rel="noopener noreferrer">
                                Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </header>
                
                {/* Screenshots Carousel */}
                <section className="mb-8">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {tool.screenshots.map((src, index) => (
                                <CarouselItem key={index}>
                                    <Card className="overflow-hidden">
                                        <Image src={src} alt={`${tool.name} screenshot ${index + 1}`} width={1200} height={800} className="w-full object-cover" data-ai-hint={tool.screenshots_hint || "product screenshot"} />
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold font-headline mb-4">About {tool.name}</h2>
                    <p className="text-lg leading-relaxed">{tool.longDescription}</p>
                </section>

                {/* Video Demo Section */}
                {tool.videoDemo && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                            <Youtube className="w-7 h-7 text-red-600" />
                            Video Demo
                        </h2>
                        <div className="aspect-video">
                        <iframe
                            className="w-full h-full rounded-lg"
                            src={tool.videoDemo}
                            title={`YouTube video player for ${tool.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        </div>
                    </section>
                )}
                
                {/* Community Reviews */}
                <ReviewSection tool={tool} />
            </div>

            {/* Sidebar Info */}
            <aside className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {tool.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Information</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Launch Date</span>
                            <span>{formatDate(tool.launchDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Last Updated</span>
                            <span>{formatDate(tool.lastUpdated)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">{tool.pricing.model}</p>
                        <p className="text-muted-foreground">{tool.pricing.details}</p>
                        {tool.pricing.isPriceReduced && (
                            <p className="mt-2 text-xs font-bold text-green-500 uppercase tracking-wide">Recent Price Drop Observed!</p>
                        )}
                    </CardContent>
                </Card>
            </aside>
        </div>
    </div>
  );
}
