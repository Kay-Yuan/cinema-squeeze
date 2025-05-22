import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
        Return to Home
      </Link>
    </div>
  )
}
