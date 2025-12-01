import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
      <Link to="/" className="mt-4 text-primary hover:underline">
        Go back home
      </Link>
    </div>
  )
}
