import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-medium mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Back to Homepage
      </Link>
    </div>
  );
} 