export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      {/* Page Title */}
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>

      {/* Form Fields */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
        {/* Button */}
        <div className="h-12 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}
