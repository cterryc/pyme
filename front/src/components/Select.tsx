import { useState, useRef, useEffect } from 'react'

interface SelectOption {
  value: string
  label: string
  icon?: string
}

interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  onSelect: (option: SelectOption) => void
  variant?: 'default' | 'button' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export const Select = ({ 
  options, 
  placeholder = "Seleccionar...", 
  onSelect, 
  variant = 'default',
  size = 'md',
  disabled = false,
  className = ""
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionClick = (option: SelectOption) => {
    setSelectedOption(option)
    setIsOpen(false)
    onSelect(option)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'lg':
        return 'px-4 py-3 text-base'
      default:
        return 'px-3 py-2 text-sm'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
      case 'outlined':
        return 'bg-transparent border-gray-300 text-gray-700 hover:border-gray-400'
      default:
        return 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
    }
  }

  const buttonClasses = `
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
    border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    flex items-center justify-between w-full
  `.trim()

  return (
    <div className="relative inline-block" ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={buttonClasses}
        disabled={disabled}
      >
        <div className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <span>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
              >
                {option.icon && (
                  <span className="mr-2">{option.icon}</span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}