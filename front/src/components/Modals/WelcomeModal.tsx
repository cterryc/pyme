import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const welcomeSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 caracteres')
})

type WelcomeFormData = z.infer<typeof welcomeSchema>

interface WelcomeModalProps {
  isOpen: boolean
  onSubmit: (data: WelcomeFormData) => void
  isPending?: boolean
}

export const WelcomeModal = ({ isOpen, onSubmit, isPending = false }: WelcomeModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema)
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'>
      <div className='relative max-w-lg w-full bg-white rounded-2xl shadow-2xl animate-[fadeIn_0.3s_ease-out,scaleIn_0.3s_ease-out] my-auto'>
        <div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl'></div>

        <div className='p-8 sm:p-10'>
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <div className='absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20'></div>
            </div>
          </div>
          <div className='text-center mb-8'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3'>
              ¡Un gusto tenerte entre nosotros!
            </h2>
            <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
              Primero que nada, queremos saber cómo te llamas y cómo contactarte
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* First Name */}
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                Nombre <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  id='firstName'
                  type='text'
                  {...register('firstName')}
                  disabled={isPending}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed'
                  placeholder='Tu nombre'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
              {errors.firstName && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                Apellido <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  id='lastName'
                  type='text'
                  {...register('lastName')}
                  disabled={isPending}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed'
                  placeholder='Tu apellido'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
              {errors.lastName && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                Teléfono <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  id='phone'
                  type='text'
                  {...register('phone')}
                  disabled={isPending}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed'
                  placeholder='+51 999 999 999'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
              </div>
              {errors.phone && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className='pt-4'>
              <button
                type='submit'
                disabled={isPending}
                className='w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2'
              >
                {isPending ? (
                  <>
                    <svg
                      className='animate-spin h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar</span>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-xs text-gray-500'>
              Esta información nos ayudará a personalizar tu experiencia
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
