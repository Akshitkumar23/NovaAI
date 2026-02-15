
import { tools } from "@/lib/data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";

export default function LaunchesPage() {
  const upcomingTools = [...tools]
    .filter(tool => new Date(tool.launchDate) > new Date())
    .sort((a, b) => new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <section>
        <div className="flex items-center gap-4 mb-8">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold font-headline">Launch Calendar</h1>
        </div>

        {upcomingTools.length > 0 ? (
          <div className="space-y-6">
            {upcomingTools.map(tool => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="hover:bg-accent transition-colors duration-200 hover:shadow-md">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="rounded-lg" data-ai-hint={tool.logo_hint || "logo"}/>
                        <div>
                          <CardTitle className="font-headline">{tool.name}</CardTitle>
                          <p className="text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                         <p className="font-semibold text-lg">Launching On</p>
                         <Badge variant="default" className="text-md">{new Date(tool.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">No Upcoming Launches</h2>
            <p className="text-muted-foreground">Check back soon for new and exciting AI tools!</p>
          </div>
        )}
      </section>
    </div>
  );
}
