
import Link from 'next/link';
import { categories, tools } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <section>
        <div className="flex items-center gap-4 mb-8">
            <Layers className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">All Categories</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            const toolCount = tools.filter(t => t.category === category.id).length;
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="h-full hover:bg-accent transition-colors duration-200 hover:shadow-md relative">
                   <Badge variant="secondary" className="absolute top-4 right-4">{toolCount}</Badge>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                        <category.icon className="w-8 h-8 text-primary" />
                        <CardTitle className="font-headline pr-10">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  );
}
