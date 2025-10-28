import { useEffect, useState, type ReactNode } from 'react'
import { IoClose } from 'react-icons/io5'
export const Modal = ({
  children,
  enable,
  onClose
}: {
  children: ReactNode
  enable?: boolean
  onClose?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(enable || false)

  useEffect(() => {
    setIsOpen(enable || false)
  }, [enable])

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  if (!isOpen) return <></>

  return (
    <div
      onClick={handleClose}
      className='fixed cursor-pointer top-0 z-100 left-0 bg-[rgba(0,0,0,.4)] w-screen h-screen flex justify-center items-center overflow-y-auto'
    >
      <div className='cursor-default class relative ' onClick={(e) => e.stopPropagation()}>
        <button
          className='absolute left-full text-3xl text-white bottom-full cursor-pointer border-2 rounded-full'
          onClick={handleClose}
        >
          <IoClose />
        </button>
        {children}
      </div>
    </div>
  )
}
