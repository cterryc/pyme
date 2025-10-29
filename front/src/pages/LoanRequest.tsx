import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import type { LoanRequestOptions } from '@/interfaces/pyme.interface'
import { usePymeLoanRequest, usePymeLoanRequestConfirm } from '@/hooks/usePyme'
import { formatToDolar } from '@/helpers/formatToDolar'
import { toast } from 'sonner'
import { SkeletonLoanForm } from '@/components/SkeletonLoanForm'
import { useQueryClient } from '@tanstack/react-query'
import { debounce } from '@/utils/debounce'

export const LoanRequest = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [loanOptions, setLoanOptions] = useState<LoanRequestOptions>()
  const [selectedTerm, setSelectedTerm] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [enableSend, setEnableSend] = useState(false)

  const { id: pymeID } = useParams<{ id: string }>()

  const debouncedToastInfo = useCallback(
    debounce((message: string, description: string) => {
      toast.info(message, {
        style: { borderColor: '#3b82f6', backgroundColor: '#eff6ff', borderWidth: '2px' },
        description,
        duration: 3000
      })
    }, 1500),
    []
  )

  const { mutate: loanRequest, isPending } = usePymeLoanRequest({
    onSuccess: (data) => {
      // console.log(data)
      setLoanOptions(data.payload)
      toast.success('Opciones de crédito disponibles', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Hemos calculado las mejores opciones de crédito para tu empresa.',
        duration: 3000
      })
    },
    onError: (dataError) => {
      console.log(dataError)
      toast.error('Error al cargar opciones de crédito', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'No se pudieron obtener las opciones de crédito. Intenta nuevamente.',
        duration: 4000
      })
    }
  })

  const { mutate: confirmLoanRequest, isPending: isPendingLoanConfirm } = usePymeLoanRequestConfirm({
    onSuccess: (data) => {
      const searchParams = new URLSearchParams({
        refNum: data.payload.applicationNumber,
        legalName: data.payload.legalName,
        interest: data.payload.offerDetails.interestRate.toString() || '0',
        amount: data.payload.selectedDetails?.amount.toString() || '0',
        months: data.payload.selectedDetails?.termMonths.toString() || '0'
      }).toString()

      queryClient.invalidateQueries({ queryKey: ['pymesByUser'] })
      queryClient.invalidateQueries({ queryKey: ['loansByUser'] })

      // console.log(data.payload.selectedDetails)
      toast.success('¡Solicitud enviada con éxito!', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Tu solicitud de crédito está siendo revisada. Nos contactaremos pronto contigo.',
        duration: 4000
      })
      navigate(`/panel/solicitar-credito/hecho?${searchParams}`)
    },
    onError: (dataError) => {
      console.log(dataError)
      toast.error('Error al enviar la solicitud', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'No se pudo procesar tu solicitud de crédito. Por favor, intenta nuevamente.',
        duration: 4000
      })
    }
  })

  useEffect(() => {
    if (!pymeID) {
      navigate('/panel')
    } 
    else {
      loanRequest({ companyId: pymeID })
    }
  }, [pymeID, navigate, loanRequest])

  useEffect(() => {
    setEnableSend(
      loanOptions != undefined &&
      selectedTerm > 0 &&
      selectedAmount >= loanOptions?.offerDetails.minAmount &&
      selectedAmount <= loanOptions?.offerDetails.maxAmount
    )
  }, [selectedAmount, selectedTerm, loanOptions])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      selectedAmount < Number(loanOptions?.offerDetails.minAmount) ||
      selectedAmount > Number(loanOptions?.offerDetails.maxAmount)
    ) {
      toast.error('', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Debes ingresar un monto dentro del rango especificado.',
        duration: 3000
      })
      return
    }

    if (selectedTerm == 0) {
      toast.error('', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Debes seleccionar la cantidad de cuotas a pagar.',
        duration: 3000
      })
      return
    }
    if (!pymeID || !loanOptions?.id) {
      toast.error('', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Error al procesar su solicitud, vuelva a intentar más tarde',
        duration: 3000
      })
      return
    }

    confirmLoanRequest({
      id: loanOptions?.id,
      companyId: pymeID,
      selectedAmount: selectedAmount,
      selectedTermMonths: selectedTerm
    })
  }

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50'>
      <Header />
      {!isPending ? (
        <section className='flex-1 flex flex-col justify-center items-center py-8 px-4'>
          <div className='w-full max-w-2xl mb-6 text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4' style={{ background: 'linear-gradient(135deg, #1193d4 0%, #0a7ab8 100%)' }}>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Solicitud de Crédito</h2>
            <p className='text-gray-600'>Completa los detalles para tu préstamo empresarial</p>
          </div>
          <form className='p-6 sm:p-10 rounded-2xl grid grid-cols-1 sm:grid-cols-2 bg-white max-w-2xl w-full shadow-2xl gap-6 border border-gray-100' onSubmit={handleSubmit}>
            <div className='sm:col-span-2'>
              <label className='text-sm font-semibold text-gray-700 mb-2 block'>Nombre de la empresa</label>
              <input
                type='text'
                className='border-2 border-gray-200 p-3 text-gray-600 bg-gray-50 w-full rounded-xl font-medium'
                disabled
                value={loanOptions?.legalName}
              />
            </div>
            <div className='sm:col-span-1'>
              <label className='text-sm font-semibold text-gray-700 mb-2 block'>Monto mínimo</label>
              <div className='border-2 border-green-200 bg-green-50 p-3 rounded-xl'>
                <p className='text-green-700 font-bold text-lg'>{formatToDolar(Number(loanOptions?.offerDetails.minAmount))}</p>
              </div>
            </div>
            <div className='sm:col-span-1'>
              <label className='text-sm font-semibold text-gray-700 mb-2 block'>Monto máximo</label>
              <div className='border-2 bg-blue-50 p-3 rounded-xl' style={{ borderColor: '#1193d4' }}>
                <p className='font-bold text-lg' style={{ color: '#1193d4' }}>{formatToDolar(Number(loanOptions?.offerDetails.maxAmount))}</p>
              </div>
            </div>

            <div className='flex flex-col gap-2 sm:col-span-2'>
              <label className='text-sm font-semibold text-gray-700'>Monto a solicitar</label>

              <div className='flex items-center border-2 gap-0 border-gray-300 overflow-hidden rounded-xl transition-all focus-within:ring-2' style={{ '--tw-ring-color': '#1193d433' } as React.CSSProperties} onFocus={(e) => e.currentTarget.style.borderColor = '#1193d4'} onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
                <span className='text-gray-700 bg-gray-100 px-4 py-3 font-semibold'>$</span>
                <input
                  type='number'
                  className='w-full outline-none py-3 px-4 text-lg font-semibold text-gray-800'
                  placeholder='Ingresa el monto'
                  value={selectedAmount || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    const maxAmount = Number(loanOptions?.offerDetails.maxAmount)
                    const minAmount = Number(loanOptions?.offerDetails.minAmount)
                    
                    // Simplemente establecer el valor sin validaciones automáticas
                    setSelectedAmount(value)
                    
                    // Mostrar advertencia si está fuera del rango (con debounce)
                    if (value > maxAmount) {
                      debouncedToastInfo(
                        'Monto fuera de rango',
                        `El monto máximo permitido es ${formatToDolar(maxAmount)}.`
                      )
                    } else if (value > 0 && value < minAmount) {
                      debouncedToastInfo(
                        'Monto fuera de rango',
                        `El monto mínimo permitido es ${formatToDolar(minAmount)}.`
                      )
                    }
                  }}
                />
                <span className='text-gray-700 bg-gray-100 px-4 py-3 font-semibold'>USD</span>
              </div>
              {selectedAmount > 0 && (
                <p className={`text-xs font-medium mt-1 ${
                  selectedAmount >= Number(loanOptions?.offerDetails.minAmount) && 
                  selectedAmount <= Number(loanOptions?.offerDetails.maxAmount)
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {selectedAmount >= Number(loanOptions?.offerDetails.minAmount) && 
                   selectedAmount <= Number(loanOptions?.offerDetails.maxAmount)
                    ? '✓ Monto válido'
                    : '✗ Monto fuera del rango permitido'}
                </p>
              )}
            </div>

            <div className='sm:col-span-2'>
              <label className='text-sm font-semibold text-gray-700 mb-3 block'>Seleccione el plazo de pago</label>
              <div className='flex gap-3 justify-center flex-wrap'>
                {loanOptions?.offerDetails.allowedTerms.map((term, i) => (
                  <RadioButton
                    text={`${term} meses`}
                    key={i}
                    selected={selectedTerm == term}
                    onClick={() => {
                      setSelectedTerm(term)
                    }}
                  />
                ))}
              </div>
            </div>

            {selectedAmount > 0 && selectedTerm > 0 && (
              <div className='sm:col-span-2 flex gap-3 flex-col rounded-2xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom duration-300' style={{ background: 'linear-gradient(135deg, #e6f6fc 0%, #f0f9ff 100%)', borderWidth: '2px', borderColor: '#1193d4' }}>
                <div className='flex items-center gap-2 mb-2'>
                  <svg className='w-5 h-5' style={{ color: '#1193d4' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                  </svg>
                  <p className='text-gray-800 font-bold text-lg'>Resumen de la solicitud</p>
                </div>

                <div className='space-y-3'>
                  <div className='flex w-full justify-between items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg'>
                    <p className='text-gray-600 text-sm font-medium'>Monto del crédito</p>
                    <p className='text-gray-900 font-bold'>{formatToDolar(selectedAmount)}</p>
                  </div>
                  <div className='flex w-full justify-between items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg'>
                    <p className='text-gray-600 text-sm font-medium'>Cantidad de cuotas</p>
                    <p className='text-gray-900 font-bold'>{selectedTerm} meses</p>
                  </div>
                  <div className='flex w-full justify-between items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg'>
                    <p className='text-gray-600 text-sm font-medium'>Monto por cuota</p>
                    <p className='text-gray-900 font-bold'>
                      {formatToDolar(
                        (selectedAmount * (1 + Number(loanOptions?.offerDetails.interestRate) / 100)) / selectedTerm
                      )}
                    </p>
                  </div>
                  <div className='flex w-full justify-between items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg'>
                    <p className='text-gray-600 text-sm font-medium'>Tasa de interés</p>
                    <p className='text-gray-900 font-bold'>{loanOptions?.offerDetails.interestRate}%</p>
                  </div>
                  <div className='flex w-full justify-between items-center px-4 py-3 rounded-xl shadow-md mt-2' style={{ background: 'linear-gradient(90deg, #1193d4 0%, #0a7ab8 100%)' }}>
                    <p className='text-white font-bold text-base'>Total a pagar</p>
                    <p className='text-white font-bold text-xl'>
                      {formatToDolar(selectedAmount * (1 + Number(loanOptions?.offerDetails.interestRate) / 100))}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!isPendingLoanConfirm ? (
              <button
                type='submit'
                disabled={!enableSend}
                className='sm:col-span-2 py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg flex items-center justify-center gap-2'
                style={enableSend ? { 
                  background: 'linear-gradient(90deg, #1193d4 0%, #0a7ab8 100%)',
                  cursor: 'pointer'
                } : {
                  background: '#9ca3af',
                  cursor: 'not-allowed',
                  opacity: 0.6
                }}
                onMouseEnter={(e) => {
                  if (enableSend) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #0a7ab8 0%, #085a8f 100%)'
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (enableSend) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #1193d4 0%, #0a7ab8 100%)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }
                }}
                onClick={(e) => {
                  if (!enableSend) {
                    e.preventDefault()
                    toast.error('No se puede enviar la solicitud', {
                      style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
                      description: 'Por favor, verifica que hayas ingresado un monto válido y seleccionado un plazo de pago.',
                      duration: 3000
                    })
                  }
                }}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span>Enviar solicitud</span>
              </button>
            ) : (
              <div className='sm:col-span-2 text-center py-3 flex justify-center items-center gap-3 rounded-xl text-white font-bold shadow-lg' style={{ background: 'linear-gradient(90deg, #1193d4 0%, #0a7ab8 100%)' }}>
                <div className='relative w-5 h-5'>
                  <div className='absolute inset-0 rounded-full border-2 border-t-transparent border-white animate-spin'></div>
                </div>
                <span>Procesando solicitud...</span>
              </div>
            )}
            <Link
              to='/panel'
              className='sm:col-span-2 bg-white border-2 border-gray-300 text-gray-700 p-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-center shadow-sm'
            >
              Volver al inicio
            </Link>
          </form>
        </section>
      ) : (
        <section className='flex-1 flex flex-col gap-15 justify-center items-center py-5 px-4'>
          <SkeletonLoanForm />
        </section>
      )}
      <Footer />
    </div>
  )
}

const RadioButton = ({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
        selected
          ? 'text-white shadow-lg scale-105'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50'
      }`}
      style={selected ? {
        background: 'linear-gradient(90deg, #1193d4 0%, #0a7ab8 100%)',
        borderColor: '#1193d4'
      } : undefined}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#1193d4'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#d1d5db'
        }
      }}
    >
      {selected && (
        <svg className='absolute top-1 right-1 w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
        </svg>
      )}
      {text}
    </button>
  )
}
