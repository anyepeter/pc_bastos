import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold font-playfair text-gray-800 mb-4">Blog Not Found</h1>
        <p className="text-gray-600 mb-6 font-inter">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Return to Blogs
        </Link>
      </div>
    </div>
  );
}
