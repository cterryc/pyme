import { useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'

export const Paginator = ({
  totalPages,
  onPagChange,
  disable
}: {
  totalPages: number
  onPagChange?: (pag: number) => void
  disable?: boolean
}) => {
  //   const Pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const [currentPage, setCurrentPage] = useState(1)
  const [visiblePags, setVisiblePags] = useState<Array<number>>([])

  const handlePage = (pag: number) => {
    setCurrentPage(pag)
    if (onPagChange) onPagChange(pag)
  }

  useEffect(() => {
    const calcPages = (): number[] => {
      if (totalPages <= 3) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      switch (currentPage) {
        case 1:
        case 2:
          return [1, 2, 3, 0, totalPages]
        case totalPages:
        case totalPages - 1:
          return [1, 0, totalPages - 2, totalPages - 1, totalPages]
        case totalPages - 2 && totalPages - 3 > 1:
          return [1, 0, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        default:
          return [1, 0, currentPage - 1, currentPage, currentPage + 1, 0, totalPages]
      }
    }
    const newVisiblePags = calcPages()
    setVisiblePags(newVisiblePags)
    // console.log(newVisiblePags)
  }, [setVisiblePags, currentPage, totalPages])

  if (totalPages == 1) {
    return <></>
  }
  if (disable) {
    return (
      <div className='flex justify-center py-3 my-5 text-[var(--primary)] text-2xl'>
        <ImSpinner8 className='animate-spin' />
      </div>
    )
  }
  return (
    <div className='py-3 my-5 flex gap-5 justify-center '>
      {visiblePags.map((pag, i) => {
        if (pag == 0) {
          return (
            <p key={i} className='text-[var(--primary)]'>
              ...
            </p>
          )
        }
        return (
          <button
            className='rounded-md aspect-square h-[30px] text-[var(--primary)] font-medium cursor-pointer hover:bg-[var(--primary)] hover:text-white'
            style={visiblePags[i] == currentPage ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
            key={i}
            onClick={() => {
              handlePage(pag)
            }}
          >
            {pag}
          </button>
        )
      })}
    </div>
  )
}
