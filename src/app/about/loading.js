export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>

      {/* Image Placeholder */}
      <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>

      {/* Paragraph Skeletons */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}
