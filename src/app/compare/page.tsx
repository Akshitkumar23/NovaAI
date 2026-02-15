
'use client';

import { useState, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { tools, categories } from '@/lib/data';
import type { Tool } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, ExternalLink, GitCompareArrows, Loader2, Sparkles, XCircle, Search } from 'lucide-react';
import { compareTools, CompareToolsOutput } from '@/ai/flows/tool-comparer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function CompareButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} size="lg" className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate AI Comparison Report
    </Button>
  );
}

async function handleCompareAction(
  previousState: any,
  formData: FormData
): Promise<CompareToolsOutput | { error: string } | null> {
  const toolsData = formData.get('tools');
  if (typeof toolsData !== 'string') {
    return { error: 'Invalid tool data' };
  }
  try {
    const toolsToCompare: Tool[] = JSON.parse(toolsData);
    if (toolsToCompare.length < 2) return null;
    return await compareTools({ tools: toolsToCompare });
  } catch(e: any) {
    return { error: 'Failed to generate comparison: ' + e.message }
  }
}

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareState, compareAction] = useActionState(handleCompareAction, null);
  
  useEffect(() => {
    const toolsFromQuery = searchParams.get('tools')?.split(',').filter(Boolean) || [];
    const validTools = toolsFromQuery.filter(id => tools.some(t => t.id === id));
    setSelectedToolIds(validTools);
  }, [searchParams]);

  const handleToolSelectionChange = (toolId: string, checked: boolean) => {
    let newSelectedIds: string[];
    if (checked) {
      if (selectedToolIds.length < 4) {
        newSelectedIds = [...selectedToolIds, toolId];
      } else {
        return;
      }
    } else {
      newSelectedIds = selectedToolIds.filter(id => id !== toolId);
    }
    
    const newParams = new URLSearchParams(searchParams.toString());
    if (newSelectedIds.length > 0) {
      newParams.set('tools', newSelectedIds.join(','));
    } else {
      newParams.delete('tools');
    }
    window.history.pushState(null, '', `/compare?${newParams.toString()}`);
    setSelectedToolIds(newSelectedIds);
  };

  const selectedTools: Tool[] = useMemo(() => {
    return selectedToolIds.map(id => tools.find(tool => tool.id === id)).filter(Boolean) as Tool[];
  }, [selectedToolIds]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();
    selectedTools.forEach(tool => {
        tool.features.forEach(feature => featureSet.add(feature));
    });
    return Array.from(featureSet).sort();
  }, [selectedTools]);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <GitCompareArrows className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold font-headline">Compare AI Tools</h1>
            </div>
            <p className="text-lg text-muted-foreground">Select up to 4 tools from the directory to compare.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {selectedToolIds.length}/4 Selected
            </Badge>
            {selectedToolIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedToolIds([])}>Clear All</Button>
            )}
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <CardTitle>Directory Search</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Find a tool..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  className={cn(
                    "flex items-center space-x-2 p-2 border rounded-lg transition-all cursor-pointer",
                    selectedToolIds.includes(tool.id) ? "bg-primary/10 border-primary" : "hover:bg-accent"
                  )}
                  onClick={() => handleToolSelectionChange(tool.id, !selectedToolIds.includes(tool.id))}
                >
                  <Checkbox
                    id={`compare-${tool.id}`}
                    checked={selectedToolIds.includes(tool.id)}
                    onCheckedChange={(checked) => handleToolSelectionChange(tool.id, !!checked)}
                    disabled={!selectedToolIds.includes(tool.id) && selectedToolIds.length >= 4}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={`compare-${tool.id}`} className="flex items-center gap-2 cursor-pointer w-full text-xs font-medium truncate">
                    <Image src={tool.logo} alt={tool.name} width={20} height={20} className="rounded-sm" />
                    {tool.name}
                  </Label>
                </div>
              ))}
              {filteredTools.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  No tools match your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {selectedTools.length > 0 && (
         <div className="flex flex-col items-center gap-4 mb-12">
            <form action={compareAction} className="w-full max-w-md">
                <input type="hidden" name="tools" value={JSON.stringify(selectedTools)} />
                <CompareButton disabled={selectedTools.length < 2} />
            </form>
         </div>
      )}
      
      {compareState && 'summary' in compareState && (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Alert className="bg-accent border-primary/20 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <AlertTitle className="font-headline text-2xl">AI Comparison Insight</AlertTitle>
                </div>
                <AlertDescription>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-headline prose-a:text-primary">
                    <ReactMarkdown>
                      {compareState.summary}
                    </ReactMarkdown>
                  </div>
                </AlertDescription>
            </Alert>
        </section>
      )}

      {compareState && 'error' in compareState && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{compareState.error}</AlertDescription>
        </Alert>
      )}


      {selectedTools.length >= 2 ? (
        <section>
          <h2 className="text-3xl font-bold font-headline mb-6">Side-by-Side Table</h2>
          <div className="overflow-x-auto border rounded-xl bg-card shadow-sm">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] font-bold text-lg align-bottom pb-8 pl-6">Core Specs</TableHead>
                  {selectedTools.map(tool => (
                    <TableHead key={tool.id} className="text-center p-6 min-w-[200px]">
                      <div className="flex flex-col items-center gap-3">
                        <Link href={`/tools/${tool.id}`} className="group">
                          <Image src={tool.logo} alt={tool.name} width={64} height={64} className="rounded-xl border shadow-sm group-hover:scale-110 transition-transform duration-200" />
                        </Link>
                        <span className="font-bold text-lg text-foreground truncate max-w-[180px]">{tool.name}</span>
                        <Badge variant="outline">{tool.pricing.model}</Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold pl-6">Headline</TableCell>
                  {selectedTools.map(tool => (
                    <TableCell key={tool.id} className="text-sm px-4">{tool.description}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold pl-6">Category</TableCell>
                  {selectedTools.map(tool => {
                    const category = categories.find(c => c.id === tool.category);
                    return <TableCell key={tool.id} className="text-sm px-4">{category?.name || 'N/A'}</TableCell>;
                  })}
                </TableRow>
                <TableRow>
                    <TableCell className="font-semibold pl-6">Pricing Details</TableCell>
                    {selectedTools.map(tool => (
                        <TableCell key={tool.id} className="text-sm px-4">{tool.pricing.details}</TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    <TableCell className="font-semibold pl-6">No-Code Support</TableCell>
                    {selectedTools.map(tool => (
                        <TableCell key={tool.id} className="text-center">
                            {tool.noCode ? <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" /> : <XCircle className="h-6 w-6 text-destructive/30 mx-auto" />}
                        </TableCell>
                    ))}
                </TableRow>

                {allFeatures.length > 0 && (
                    <>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={selectedTools.length + 1} className="font-bold text-base py-4 pl-6">
                                Feature Comparison
                            </TableCell>
                        </TableRow>
                        {allFeatures.map(feature => (
                            <TableRow key={feature}>
                                <TableCell className="font-semibold text-sm pl-6">{feature}</TableCell>
                                {selectedTools.map(tool => (
                                    <TableCell key={tool.id} className="text-center">
                                        {tool.features.includes(feature) ? <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" /> : <XCircle className="h-6 w-6 text-muted-foreground/10 mx-auto" />}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </>
                )}
                
                <TableRow>
                    <TableCell className="pl-6"></TableCell>
                    {selectedTools.map(tool => (
                        <TableCell key={tool.id} className="text-center p-6">
                            <Button asChild variant="outline" size="sm" className="w-full">
                                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                                    Official Site <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                        </TableCell>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      ) : selectedToolIds.length > 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/20 animate-pulse">
            <GitCompareArrows className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Select at least one more tool</h2>
            <p className="text-muted-foreground">Compare up to 4 tools to see AI-powered insights.</p>
        </div>
      ) : null}
    </div>
  );
}
