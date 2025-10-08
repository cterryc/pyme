export const ProgressBar = ({
  percent,
  title,
  barHeight,
  padding = 0
}: {
  percent: number
  title: string
  barHeight: number
  padding: number
}) => {
  return (
    <div className='w-full font-medium text-[var(--primary)]' style={{ padding: `${padding}px` }}>
      <div className='flex justify-between mb-2'>
        <p>{title}</p>
        <p>{percent}% completado</p>
      </div>
      <div className='bg-[#c8e3f0] rounded-xl overflow-hidden' style={{ height: `${barHeight}px` }}>
        <div className='bg-[var(--primary)] h-full' style={{ maxWidth: '100%', width: `${percent}%` }}></div>
      </div>
    </div>
  )
}
