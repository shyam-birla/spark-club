export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-24 w-24 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Section Titles */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

      {/* Content Blocks */}
      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}
