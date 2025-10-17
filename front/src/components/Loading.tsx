import { ImSpinner9 } from 'react-icons/im'
export const Loading = ({ dark }: { dark: boolean }) => {
  if (dark) {
    return (
      <div className='flex flex-col gap-15 items-center text-5xl text-[var(--primary)]'>
        <span>Cargando</span>
        <ImSpinner9 className='w-[200px] h-[200px] animate-spin' />
      </div>
    )
  } else {
    return (
      <div className='flex flex-col gap-15 items-center text-5xl text-white'>
        <span>Cargando ...</span>
        <ImSpinner9 className='w-[200px] h-[200px] animate-spin' />
      </div>
    )
  }
}
