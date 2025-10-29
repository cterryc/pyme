export const Loading = ({ dark }: { dark: boolean }) => {
  return (
    <div className='flex flex-col gap-8 items-center justify-center p-8'>
      <div className='relative w-24 h-24 sm:w-32 sm:h-32'>
        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
          dark 
            ? 'border-blue-200' 
            : 'border-white/30'
        }`}></div>
        
        <div className={`absolute inset-2 rounded-full border-4 border-b-transparent animate-spin ${
          dark 
            ? 'border-blue-400' 
            : 'border-white/50'
        }`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        
        <div className={`absolute inset-4 rounded-full border-4 border-t-transparent animate-spin ${
          dark 
            ? 'border-blue-600' 
            : 'border-white/70'
        }`} style={{ animationDuration: '1s' }}></div>
        
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`w-3 h-3 rounded-full ${
            dark 
              ? 'bg-blue-600' 
              : 'bg-white'
          } animate-pulse`}></div>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <span className={`text-lg sm:text-xl font-semibold ${
          dark 
            ? 'text-gray-700' 
            : 'text-white'
        }`}>
          Cargando
        </span>
        <div className='flex gap-1'>
          <span className={`w-1.5 h-1.5 rounded-full ${
            dark ? 'bg-blue-600' : 'bg-white'
          } animate-bounce`} style={{ animationDelay: '0ms' }}></span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            dark ? 'bg-blue-600' : 'bg-white'
          } animate-bounce`} style={{ animationDelay: '150ms' }}></span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            dark ? 'bg-blue-600' : 'bg-white'
          } animate-bounce`} style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  )
}
