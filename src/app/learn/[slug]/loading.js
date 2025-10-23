export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 animate-pulse">
      {/* Sidebar Skeleton */}
      <aside className="w-full md:w-80 h-48 md:h-full bg-white border-r border-gray-200 overflow-hidden p-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="aspect-video w-full rounded-lg bg-gray-200 mb-8"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="mt-8 flex justify-between">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
