export const UserProfileSkeleton = () => {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="flex p-4 w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-full w-40 h-40 bg-gray-300" />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="h-5 w-3/4 bg-gray-300 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <div className="flex-1 h-12 bg-gray-300 rounded" />
        <div className="flex-1 h-12 bg-gray-300 rounded" />
      </div>
    </div>
  )
}
