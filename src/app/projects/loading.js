export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-12 mx-auto"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg overflow-hidden h-72">
            <div className="h-40 bg-gray-200 w-full"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
