import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { LoanRequestOptions } from '@/interfaces/pyme.interface'
import { usePymeLoanRequest, usePymeLoanRequestConfirm } from '@/hooks/usePyme'
import { formatToDolar } from '@/helpers/formatToDolar'
import { toast } from 'sonner'
import { Loading } from '@/components/Loading'
import { useQueryClient } from '@tanstack/react-query'
import { ImSpinner8 } from 'react-icons/im'

export const LoanRequest = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [loanOptions, setLoanOptions] = useState<LoanRequestOptions>()
  const [selectedTerm, setSelectedTerm] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [enableSend, setEnableSend] = useState(false)

  const { id: pymeID } = useParams<{ id: string }>()

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
    <div className='flex flex-col min-h-screen'>
      <Header />
      {!isPending ? (
        <section className='flex-1 flex flex-col gap-15 justify-center items-center py-5'>
          <form className='p-10 rounded-xl grid grid-cols-2 bg-white max-w-xl shadow-2xl gap-6' onSubmit={handleSubmit}>
            <div className='col-span-2'>
              <p className='text-[#334155] font-medium'>Nombre de la empresa:</p>
              <input
                type='text'
                className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
                disabled
                value={loanOptions?.legalName}
              />
            </div>
            <div className='col-span-1'>
              <p className='text-[#334155] font-medium'>Monto mínimo</p>
              <input
                type='text'
                className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
                disabled
                value={formatToDolar(Number(loanOptions?.offerDetails.minAmount))}
              />
            </div>
            <div className='col-span-1'>
              <p className='text-[#334155] font-medium'>Monto máximo</p>
              <input
                type='text'
                className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
                disabled
                value={formatToDolar(Number(loanOptions?.offerDetails.maxAmount))}
              />
            </div>

            <div className='flex flex-col gap-1 col-span-2 '>
              <p className='text-sm'>Monto a solicitar</p>

              <div className='flex items-center border gap-2 border-[#D1D5DB] overflow-hidden rounded-md focus-within:border-black '>
                <span className='text-[var(--font-title-light)] bg-[#D1D5DB] p-3'>$</span>
                <input
                  type='number'
                  className='w-full outline-none py-3'
                  placeholder='1000'
                  value={selectedAmount || ''}
                  // min={successResponse.minAmount}
                  // max={successResponse.maxAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    const maxAmount = Number(loanOptions?.offerDetails.maxAmount)
                    
                    if (value > maxAmount) {
                      setSelectedAmount(maxAmount)
                      toast.info('Monto ajustado', {
                        style: { borderColor: '#3b82f6', backgroundColor: '#eff6ff', borderWidth: '2px' },
                        description: `El monto ingresado supera el máximo permitido. Se ha ajustado a ${formatToDolar(maxAmount)}.`,
                        duration: 3000
                      })
                    } else {
                      setSelectedAmount(value)
                    }
                  }}
                />
                <span className='text-[#414141FF] bg-[#D1D5DB] p-3'>US$</span>
              </div>
            </div>

            <div className='col-span-2'>
              <p className='text-[#334155] font-medium '>Seleccione el plazo de pago</p>
              <div className='flex gap-4 justify-center flex-wrap my-4'>
                {loanOptions?.offerDetails.allowedTerms.map((term, i) => (
                  <RadioButton
                    text={`${term} MESES`}
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
              <div className='col-span-2 flex gap-1 flex-col items-center bg-[#f8fafc] border border-[#ccc] rounded-xl p-5'>
                <p className='text-[#334155] font-medium mb-2'>Resumen de la solicitud:</p>

                <div className='flex w-full justify-between text-sm'>
                  <p>Monto del crédito :</p>
                  <p className='text-[#333] font-medium'>{formatToDolar(selectedAmount)}</p>
                </div>
                <div className='flex w-full justify-between text-sm'>
                  <p>Cantidad de cuotas :</p>
                  <p className='text-[#333] font-medium'>{selectedTerm}</p>
                </div>
                <div className='flex w-full justify-between text-sm'>
                  <p>Monto por cuota :</p>
                  <p className='text-[#333] font-medium'>
                    {formatToDolar(
                      (selectedAmount * (1 + Number(loanOptions?.offerDetails.interestRate) / 100)) / selectedTerm
                    )}
                  </p>
                </div>
                <div className='flex w-full justify-between text-sm '>
                  <p>Interés :</p>
                  <p className='text-[#333] font-medium'>{loanOptions?.offerDetails.interestRate} %</p>
                </div>
                <div className='flex w-full justify-between text border-t-1 mt-3 border-[#ccc] py-2'>
                  <p className='text-[#333] font-medium'>Total a pagar:</p>
                  <p className='text-[var(--primary)] font-medium'>
                    {formatToDolar(selectedAmount * (1 + Number(loanOptions?.offerDetails.interestRate) / 100))}
                  </p>
                </div>
              </div>
            )}
            {!isPendingLoanConfirm ? (
              <input
                type='submit'
                className='bg-[var(--primary)] col-span-2 py-3 rounded-md text-white font-medium cursor-pointer hover:bg-[#0c6b9b] duration-150'
                value='Enviar solicitud'
                style={{ 
                  background: !enableSend ? 'gray' : '',
                  cursor: !enableSend ? 'not-allowed' : 'pointer'
                }}
                disabled={!enableSend}
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
              />
            ) : (
              <div className='bg-[gray] text-center col-span-2 py-3 flex justify-center rounded-md text-white font-medium cursor-pointer'>
                <ImSpinner8 className='animate-spin' />
              </div>
            )}
            <Link
              to='/panel'
              className='bg-[var(--primary)] col-span-2 p-3  rounded-md text-white font-medium cursor-pointer hover:bg-[#0c6b9b] duration-150 w-full text-center'
            >
              Volver al inicio
            </Link>
          </form>
        </section>
      ) : (
        <div className='flex-1'>
          <Loading dark />
        </div>
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
  onClick: React.MouseEventHandler<HTMLSpanElement>
}) => {
  return (
    <span
      onClick={onClick}
      className='bg-white text-black p-2 px-4 border ccc  rounded-xlrounded-lg block cursor-pointer text-center'
      style={{
        background: selected ? 'var(--primary)' : 'white',
        color: selected ? 'white' : 'var(--font-title-light)',
        borderColor: selected ? 'var(--primary)' : '#ccc'
      }}
    >
      {text}
    </span>
  )
}
