export const SkeletonLoanForm = () => {
  return (
    <div className='p-6 sm:p-10 rounded-xl bg-white max-w-xl w-full shadow-2xl animate-pulse'>
      <div className='mb-6'>
        <div className='h-4 bg-gray-300 rounded w-40 mb-3'></div>
        <div className='h-12 bg-gray-200 rounded-md w-full'></div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6'>
        <div>
          <div className='h-4 bg-gray-300 rounded w-28 mb-3'></div>
          <div className='h-12 bg-gray-200 rounded-md w-full'></div>
        </div>
        <div>
          <div className='h-4 bg-gray-300 rounded w-28 mb-3'></div>
          <div className='h-12 bg-gray-200 rounded-md w-full'></div>
        </div>
      </div>

      <div className='mb-6'>
        <div className='h-4 bg-gray-300 rounded w-36 mb-3'></div>
        <div className='h-12 bg-gray-200 rounded-md w-full'></div>
      </div>

      <div className='mb-6'>
        <div className='h-4 bg-gray-300 rounded w-44 mb-4'></div>
        <div className='flex gap-3 justify-center flex-wrap'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-10 w-24 bg-gray-200 rounded-lg'></div>
          ))}
        </div>
      </div>
      <div className='space-y-3 mt-8'>
        <div className='h-12 bg-gray-300 rounded-md w-full'></div>
        <div className='h-12 bg-gray-200 rounded-md w-full'></div>
      </div>
    </div>
  )
}
