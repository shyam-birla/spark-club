export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      {/* Page Title */}
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 h-32">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Table/List Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="bg-gray-100 rounded-lg p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
