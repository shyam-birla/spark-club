export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>

      {/* Status/Info Skeletons */}
      <div className="space-y-4 max-w-md mx-auto mb-12">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Certificate Placeholder (if applicable) */}
      <div className="h-96 bg-gray-200 rounded-lg w-full max-w-3xl mx-auto"></div>
    </div>
  );
}
