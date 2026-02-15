import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-headline mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">Sorry, we couldn’t find the page you’re looking for.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
