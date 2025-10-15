import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerPymeSchema, type RegisterPymeFormData } from '@/schemas/pyme.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePymeRegister } from '@/hooks/usePyme'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useUserAuthenticate } from '@/hooks/useUser'
import Confetti from 'react-confetti'

export const RegisterPyme = () => {
  const navigate = useNavigate()
  const maxStep = 4
  const [step, setStep] = useState(0)
  const [pymeId, setPymeId] = useState('')
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 })
  const { getUser, isLoading } = useUserAuthenticate()

  const {
    mutate: pymeRegister,
    isPending,
    isError,
    error
  } = usePymeRegister({
    onSuccess: (data) => {
      // console.log(data)
      toast.success('La pyme fue registrada correctamente', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Debes adjuntar y firmar el poder notarial si no eres el dueño de la pyme.',
        duration: 4000
      })
      localStorage.removeItem('registerPymeBackup')
      //navigate(`/Dashboard/RegistroDocumentosPyme/${data.payload.id}`, { replace: true })
      setPymeId(data.payload.id)
    },
    onError: (dataError) => {
      toast.error('', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: dataError.payload.message,
        duration: 4000
      })
    }
  })

  //checkear sesion
  useEffect(() => {
    setConfettiSize({ width: window.innerWidth, height: window.innerHeight })
    if (!isLoading && getUser == '') {
      navigate('/Login')
    }
  }, [getUser, isLoading, navigate])

  useEffect(() => {
    if (isPending) {
      toast('Guardando los cambios ...', { duration: 1000 })
    }
  }, [isPending, isError, error])

  const getStoredData = () => {
    const storedForm = localStorage.getItem('registerPymeBackup')
    if (storedForm) {
      const storedDataForm = JSON.parse(storedForm)
      return storedDataForm
    }
    return {}
  }

  const {
    register: registerPyme,
    // setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeFormData>({
    resolver: zodResolver(registerPymeSchema),
    defaultValues: getStoredData()
  })

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setStep(0)
    }
  }, [errors, setStep])

  const onSubmit = (data: RegisterPymeFormData) => {
    // localStorage.removeItem('registerPymeBackup')
    pymeRegister(data)
  }

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (step < maxStep) {
      setStep(step + 1)
    }
  }
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (step > 0) {
      setStep(step - 1)
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('registerPymeBackup', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <Header />

      <section className='w-full max-w-7xl py-5 my-10 m-auto text-center flex-1 min-h-screen'>
        <h2 className='text-3xl my-3 text-[var(--font-title-light)] font-medium'>Registra de PYME</h2>
        <p>Completa la información para crear el perfil de tu empresa.</p>

        <ProgressBar percent={Math.floor(100 / maxStep) * step} title='Progreso' barHeight={10} padding={30} />

        {Object.keys(errors).length > 0 && <p className='text-red-500 text-xl'>Hay errores en el formulario</p>}

        <form className='flex flex-col text-left px-10 md:px-20 mt-5' onSubmit={handleSubmit(onSubmit)}>
          {step == 0 && (
            <div>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] py-2 mb-5'>
                Información básica
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre legal</p>

                  <input
                    type='text'
                    {...registerPyme('legalName')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre legal de la empresa'
                    style={{ borderColor: errors.legalName ? 'red' : '' }}
                  />
                  {errors.legalName && <p className='text-red-500 text-center'>{errors.legalName.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre comercial</p>

                  <input
                    {...registerPyme('tradeName')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre comercial de la empresa'
                    style={{ borderColor: errors.tradeName ? 'red' : '' }}
                  />
                  {errors.tradeName && <p className='text-red-500 text-center'>{errors.tradeName.message}</p>}
                </div>

                {/* <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre del propietario</p>

                  <input
                    type='text'
                    {...registerPyme('ownerName')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre del propietario de la empresa'
                    style={{ borderColor: errors.ownerName ? 'red' : '' }}
                  />
                  {errors.ownerName && <p className='text-red-500 text-center'>{errors.ownerName.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Apellido del propietario</p>

                  <input
                    {...registerPyme('ownerSurname')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Apellido del propietario de la empresa'
                    style={{ borderColor: errors.ownerSurname ? 'red' : '' }}
                  />
                  {errors.ownerSurname && <p className='text-red-500 text-center'>{errors.ownerSurname.message}</p>}
                </div> */}

                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>CUIT</p>

                  <input
                    type='text'
                    {...registerPyme('taxId')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='XX-XXXXXXXX-X'
                    style={{ borderColor: errors.taxId ? 'red' : '' }}
                  />
                  {errors.taxId && <p className='text-red-500 text-center'>{errors.taxId.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Correo electrónico</p>

                  <input
                    type='text'
                    {...registerPyme('email')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='contacto@empresa.com'
                    style={{ borderColor: errors.email ? 'red' : '' }}
                  />
                  {errors.email && <p className='text-red-500 text-center'>{errors.email.message}</p>}
                </div>
              </div>
            </div>
          )}
          {step == 1 && (
            <div>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
                Detalles de la empresa
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Industria</p>
                  <select
                    style={{ borderColor: errors.industry ? 'red' : '' }}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    {...registerPyme('industry')}
                  >
                    <option value='_'>Seleccionar industria</option>
                    <option value='Industria_agricola'>Agrícola</option>
                    <option value='Industria_Tecnologia'>Tecnología</option>
                    <option value='Industria_Contaduria'>Contaduría</option>
                    <option value='Industria_ValoresArbitrarios'>etc ...</option>
                    <option value='Industria_OTRO'>Otro</option>
                  </select>
                  {errors.industry && <p className='text-red-500 text-center'>{errors.industry.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Fecha de fundación</p>

                  <input
                    type='date'
                    {...registerPyme('foundedDate', { valueAsDate: true })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre comercial de la empresa'
                    style={{ borderColor: errors.foundedDate ? 'red' : '' }}
                  />
                  {errors.foundedDate && <p className='text-red-500 text-center'>{errors.foundedDate.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Cantidad empleados</p>

                  <input
                    type='number'
                    {...registerPyme('employeeCount', { valueAsNumber: true })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='100'
                    style={{ borderColor: errors.employeeCount ? 'red' : '' }}
                  />
                  {errors.employeeCount && <p className='text-red-500 text-center'>{errors.employeeCount.message}</p>}
                </div>
                <div className='flex flex-col gap-1 '>
                  <p className='text-sm'>Ingresos anuales</p>

                  <div
                    style={{ borderColor: errors.annualRevenue ? 'red' : '' }}
                    className='flex items-center border gap-2 border-[#D1D5DB] overflow-hidden rounded-md focus-within:border-black '
                  >
                    <span className='text-[var(--font-title-light)] bg-[#D1D5DB] p-2'>$</span>
                    <input
                      type='number'
                      {...registerPyme('annualRevenue', { valueAsNumber: true })}
                      className='w-full outline-none py-2'
                      placeholder='1000000'
                      min={0}
                    />
                    <span className='text-[#414141FF] bg-[#D1D5DB] p-2'>USD</span>
                  </div>

                  {errors.annualRevenue && <p className='text-red-500 text-center'>{errors.annualRevenue.message}</p>}
                </div>
              </div>
            </div>
          )}
          {step == 2 && (
            <div>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
                Dirección
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Dirección</p>

                  <input
                    {...registerPyme('address')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Av.Corrientes 1234'
                    style={{ borderColor: errors.address ? 'red' : '' }}
                  />
                  {errors.address && <p className='text-red-500 text-center'>{errors.address.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Ciudad</p>

                  <input
                    type='text'
                    {...registerPyme('city')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Ciudad Autónoma de Buenos Aires'
                    style={{ borderColor: errors.city ? 'red' : '' }}
                  />
                  {errors.city && <p className='text-red-500 text-center'>{errors.city.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Estado/Provincia</p>

                  <input
                    type='text'
                    {...registerPyme('state')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Caba'
                    style={{ borderColor: errors.state ? 'red' : '' }}
                  />
                  {errors.state && <p className='text-red-500 text-center'>{errors.state.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Código postal</p>

                  <input
                    type='text'
                    {...registerPyme('postalCode')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='C1043AAS'
                    style={{ borderColor: errors.postalCode ? 'red' : '' }}
                  />
                  {errors.postalCode && <p className='text-red-500 text-center'>{errors.postalCode.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>País</p>

                  <input
                    type='text'
                    {...registerPyme('country')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Argentina'
                    style={{ borderColor: errors.country ? 'red' : '' }}
                  />
                  {errors.country && <p className='text-red-500 text-center'>{errors.country.message}</p>}
                </div>
              </div>
            </div>
          )}
          {step == 3 && (
            <div>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
                Contacto y descripción
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Teléfono empresarial</p>
                  <input
                    type='text'
                    {...registerPyme('phone')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='+54 11 1234-5678'
                    style={{ borderColor: errors.phone ? 'red' : '' }}
                  />
                  {errors.phone && <p className='text-red-500 text-center'>{errors.phone.message}</p>}
                </div>

                <div className='flex flex-col gap-1 col-span-2'>
                  <p className='text-sm'>Website (opcional)</p>
                  <input
                    type='text'
                    {...(registerPyme('website'), { required: false })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='https://www.empresa.com'
                    style={{ borderColor: errors.website ? 'red' : '' }}
                  />
                  {errors.website && <p className='text-red-500 text-center'>{errors.website.message}</p>}
                </div>
                <div className='flex flex-col gap-1 col-span-2'>
                  <p className='text-sm'>Descripción</p>
                  <textarea
                    rows={5}
                    {...registerPyme('description')}
                    className='border min-h-30 max-h-60 p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Describe brevemente tu empresa...'
                    style={{ borderColor: errors.description ? 'red' : '' }}
                  />
                  {errors.description && <p className='text-red-500 text-center'>{errors.description.message}</p>}
                </div>
              </div>
            </div>
          )}
          {step == 4 && (
            <div className='flex flex-col gap-5'>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
                Confirma tus datos
              </h3>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Nombre legal :</span> {getStoredData().legalName}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Nombre comercial : </span>
                {getStoredData().tradeName}
              </p>
              {/* <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Nombre del propietario :</span>
                {getStoredData().ownerName}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Apellido del propietario : </span>
                {getStoredData().ownerSurname}
              </p> */}
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>CUIT : </span>
                {getStoredData().taxId}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Correo electrónico : </span>
                {getStoredData().email}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Industria : </span>
                {getStoredData().industry}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Fecha fundacion : </span>
                {new Date(getStoredData().foundedDate).toLocaleDateString('es-ES')}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Cantidad de empleados : </span>
                {getStoredData().employeeCount}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Ingresos anuales : </span>
                {getStoredData().annualRevenue}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Dirección : </span>
                {getStoredData().address}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Ciudad : </span>
                {getStoredData().city}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Estado/Provincia : </span>
                {getStoredData().state}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Código postal : </span>
                {getStoredData().postalCode}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>País : </span>
                {getStoredData().country}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Telefono empresarial : </span>
                {getStoredData().phone}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Website : </span>
                {getStoredData().website}
              </p>
              <p className='border-b-1 border-[#ddd]'>
                <span className='font-bold'>Descripción : </span>
                {getStoredData().description}
              </p>
            </div>
          )}

          <div className='flex text-center justify-between px-10 md:px-20 mt-20'>
            <button
              className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
              onClick={prevStep}
            >
              Atrás
            </button>
            {step != maxStep && (
              <button
                className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
                onClick={nextStep}
              >
                Siguiente
              </button>
            )}
            {step == maxStep && (
              <input
                type='submit'
                className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
                value='Confirmar'
              />
            )}
          </div>
        </form>
      </section>

      {pymeId != '' && (
        <div className='fixed w-screen h-screen bg-[rgba(0,0,0,.4)] top-[0] left-[0] flex items-center '>
          <Confetti width={confettiSize.width} height={confettiSize.height} initialVelocityY={10} />

          <dialog open className='bg-[var(--bg-light)] p-7 m-auto text-black rounded-md'>
            <h3 className='text-xl text-center mb-5'>Tu pyme se ha registrado correctamente</h3>
            <p className='px-5 mb-2'>Es obligatorio adjuntar documentos para solicitar un crédito</p>
            <p className='px-5 mb-7 text-center '>¿Quieres continuar ahora?</p>
            <div className='flex justify-around'>
              <button
                className='bg-gray-500 p-2 rounded-md cursor-pointer text-white'
                onClick={() => {
                  navigate('/Dashboard')
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // navigate(`/Dashboard/RegistroDocumentosPyme/${pymeId}`, { replace: true })
                  navigate(`/Dashboard/RegistroDocumentosPyme/${pymeId}`)
                }}
                className='bg-green-500 p-2 rounded-md cursor-pointer text-white hover:bg-green-700 duration-150'
              >
                Continuar
              </button>
            </div>
          </dialog>
        </div>
      )}
      <Footer />
    </>
  )
}
