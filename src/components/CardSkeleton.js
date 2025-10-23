const CardSkeleton = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative w-full h-40 md:h-72 bg-gray-200"></div>
      <div className="p-1 flex-grow">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex flex-wrap gap-1 mt-2">
          <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/5"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
