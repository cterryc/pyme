import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { type LoanRequestResponse } from '@/interfaces/pyme.interface'
import { usePymeLoanRequest } from '@/hooks/usePyme'

const exampleSuccessResponse = {
  tradeName: 'Empresa re piola',
  minAmount: '5000',
  maxAmount: '50000',
  paymentOptions: [
    {
      paymentsNumber: '6',
      interestRate: '5'
    },
    {
      paymentsNumber: '12',
      interestRate: '6.5'
    },
    {
      paymentsNumber: '18',
      interestRate: '7.7'
    },
    {
      paymentsNumber: '24',
      interestRate: '7.3'
    },
    {
      paymentsNumber: '36',
      interestRate: '8.5'
    }
  ]
}

export const LoanRequest = () => {
  const navigate = useNavigate()
  const { id: pymeID } = useParams<{ id: string }>()
  const [successResponse, setSuccessResponse] = useState<LoanRequestResponse>(exampleSuccessResponse)
  const [loanRequest, setLoanRequest] = useState({
    pymeId: pymeID,
    amount: 0,
    paymentNumber: 0,
    interestRate: 0
  })

  const {
    mutate: loanOptions
    // isPending,
    // isError,
    // error
  } = usePymeLoanRequest({
    onSuccess: (data) => {
      //opciones de credito recibidas
      console.log(data)
      setSuccessResponse(data)
    }
  })

  useEffect(() => {
    if (!pymeID) {
      navigate('/Dashboard')
    } else {
      // loanOptions({ pymeId: pymeID })
    }
  }, [pymeID, navigate, loanOptions])

  useEffect(() => {
    //Renderizar el formulario en funcion de la respuesta
  }, [successResponse])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      loanRequest.amount < Number(successResponse.minAmount) ||
      loanRequest.amount > Number(successResponse.maxAmount)
    ) {
      toast.error('Error', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Debes ingresar un monto válido',
        duration: 4000
      })
      return
    }

    if (loanRequest.paymentNumber == 0) {
      toast.error('Error', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Debes seleccionar un plazo de pago',
        duration: 4000
      })
      console.log('error')
      return
    }

    const toastLoading = toast.loading('Enviando...', {
      style: { borderColor: 'var(--primary)', backgroundColor: '#f1f8ffff', borderWidth: '1px' }
    })

    //TEMPORAL, DEBE HACERLO AL TENER LA RESPUESTA DE BACK
    setTimeout(() => {
      toast.dismiss(toastLoading)
    }, 2000)
    console.log(loanRequest)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <section className='flex-1 flex justify-center items-center'>
        <form className='p-10 rounded-xl grid grid-cols-2 bg-white max-w-xl shadow-2xl gap-6' onSubmit={handleSubmit}>
          <div className='col-span-2'>
            <p className='text-[#334155] font-medium'>Nombre de la empresa:</p>
            <input
              type='text'
              className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
              disabled
              value={successResponse.tradeName}
            />
          </div>
          <div className='col-span-1'>
            <p className='text-[#334155] font-medium'>Monto mínimo</p>
            <input
              type='text'
              className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
              value={`$${successResponse.minAmount}`}
              disabled
            />
          </div>
          <div className='col-span-1'>
            <p className='text-[#334155] font-medium'>Monto máximo</p>
            <input
              type='text'
              className='border border-[#bbb] p-3 text-[#6e7d93] bg-[#f1f5f9] w-full rounded-md'
              value={`$${successResponse.maxAmount}`}
              disabled
            />
          </div>

          <div className='flex flex-col gap-1 col-span-2 '>
            <p className='text-sm'>Ingresos anuales</p>

            <div className='flex items-center border gap-2 border-[#D1D5DB] overflow-hidden rounded-md focus-within:border-black '>
              <span className='text-[var(--font-title-light)] bg-[#D1D5DB] p-3'>$</span>
              <input
                type='number'
                className='w-full outline-none py-3'
                placeholder='1000000'
                // min={successResponse.minAmount}
                // max={successResponse.maxAmount}
                onChange={(e) => {
                  const newLoanRequest = { ...loanRequest }
                  newLoanRequest.amount = Number(e.target.value)
                  setLoanRequest(newLoanRequest)
                }}
              />
              <span className='text-[#414141FF] bg-[#D1D5DB] p-3'>USD</span>
            </div>
          </div>

          <div className='col-span-2'>
            <p className='text-[#334155] font-medium '>Seleccione el plazo de pago</p>
            <div className='flex gap-4 justify-center flex-wrap my-4'>
              {successResponse.paymentOptions &&
                successResponse.paymentOptions.map((opt, i) => {
                  return (
                    <label key={i}>
                      <input type='radio' name='paymentNumber' className='hidden' value='6' />
                      <RadioButton
                        onClick={(e) => {
                          e.preventDefault()
                          const newLoanRequest = { ...loanRequest }
                          newLoanRequest.paymentNumber = Number(opt.paymentsNumber)
                          newLoanRequest.interestRate = Number(opt.interestRate)
                          setLoanRequest(newLoanRequest)
                        }}
                        text={`${opt.paymentsNumber} MESES`}
                        selected={loanRequest.paymentNumber == Number(opt.paymentsNumber)}
                      />
                    </label>
                  )
                })}
            </div>
          </div>
          {loanRequest.paymentNumber > 0 && (
            <div className='col-span-2 flex gap-1 flex-col items-center bg-[#f8fafc] border border-[#ccc] rounded-xl p-5'>
              <p className='text-[#334155] font-medium mb-2'>Resumen de la solicitud:</p>

              <div className='flex w-full justify-between text-sm'>
                <p>Monto del crédito :</p>
                <p className='text-[#333] font-medium'>${loanRequest.amount}</p>
              </div>
              <div className='flex w-full justify-between text-sm'>
                <p>Cantidad de cuotas :</p>
                <p className='text-[#333] font-medium'>{loanRequest.paymentNumber}</p>
              </div>
              <div className='flex w-full justify-between text-sm'>
                <p>Monto por cuota :</p>
                <p className='text-[#333] font-medium'>
                  $
                  {(
                    loanRequest.amount *
                    (1 + loanRequest.interestRate / 100) *
                    (1 / loanRequest.paymentNumber)
                  ).toFixed(2)}
                </p>
              </div>
              <div className='flex w-full justify-between text-sm '>
                <p>Interés :</p>
                <p className='text-[#333] font-medium'>{loanRequest.interestRate} %</p>
              </div>
              <div className='flex w-full justify-between text border-t-1 mt-3 border-[#ccc] py-2'>
                <p className='text-[#333] font-medium'>Total a pagar:</p>
                <p className='text-[var(--primary)] font-medium'>
                  ${(loanRequest.amount * (1 + loanRequest.interestRate / 100)).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <input
            type='submit'
            className='bg-[var(--primary)] col-span-2 py-3 rounded-md text-white font-medium cursor-pointer hover:bg-[#0c6b9b] duration-150'
            value='Enviar solicitud'
          />
        </form>
      </section>
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
