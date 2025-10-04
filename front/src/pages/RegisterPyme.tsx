import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerPymeSchema, type RegisterPymeData } from '@/schemas/pyme.schema'
import { zodResolver } from '@hookform/resolvers/zod'

export const RegisterPyme = () => {
  const maxStep = 3
  const [step, setStep] = useState(0)
  const {
    register: registerPyme,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeData>({
    resolver: zodResolver(registerPymeSchema)
  })

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setStep(0)
    }
  }, [errors, setStep])

  const onSubmit = (data: RegisterPymeData) => {
    console.log(data)
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

  return (
    <>
      <Header avatar={''} />
      <section className='w-full max-w-7xl py-5 my-10 m-auto text-center'>
        <h2 className='text-3xl my-3 text-[var(--font-title-light)] font-medium'>Registra de PYME</h2>
        <p>Completa la información para crear el perfil de tu empresa.</p>

        <ProgressBar percent={33 * step} title='Progreso' barHeight={10} padding={30} />

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
                    {...registerPyme('nombreLegal')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre legal de la empresa'
                    style={{ borderColor: errors.nombreLegal ? 'red' : '' }}
                  />
                  {errors.nombreLegal && <p className='text-red-500 text-center'>{errors.nombreLegal.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre comercial</p>

                  <input
                    {...registerPyme('nombreComercial')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre comercial de la empresa'
                  />
                  {errors.nombreComercial && (
                    <p className='text-red-500 text-center'>{errors.nombreComercial.message}</p>
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>CUIT</p>

                  <input
                    type='text'
                    {...registerPyme('taxId')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='XX-XXXXXXXX-X'
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
                  />
                  {errors.email && <p className='text-red-500 text-center'>{errors.email.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre dueño</p>

                  <input
                    {...registerPyme('nombreDuenio')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre del titular de la empresa'
                  />
                  {errors.nombreDuenio && <p className='text-red-500 text-center'>{errors.nombreDuenio.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Apellido dueño</p>

                  <input
                    type='text'
                    {...registerPyme('apellidoDuenio')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Apellido del titular de la empresa'
                  />
                  {errors.apellidoDuenio && <p className='text-red-500 text-center'>{errors.apellidoDuenio.message}</p>}
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
                  <select className='border p-2 border-[#D1D5DB] rounded-md' {...registerPyme('industria')}>
                    <option value='_'>Seleccionar industria</option>
                    <option value='Industria_agricola'>Agrícola</option>
                    <option value='Industria_Tecnologia'>Tecnología</option>
                    <option value='Industria_Contaduria'>Contaduría</option>
                    <option value='Industria_ValoresArbitrarios'>etc ...</option>
                    <option value='Industria_OTRO'>Otro</option>
                  </select>
                  {errors.industria && <p className='text-red-500 text-center'>{errors.industria.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Fecha de fundación</p>

                  <input
                    type='date'
                    {...registerPyme('fechaCreacion', { valueAsDate: true })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre comercial de la empresa'
                  />
                  {errors.fechaCreacion && <p className='text-red-500 text-center'>{errors.fechaCreacion.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Cantidad empleados</p>

                  <input
                    type='number'
                    {...registerPyme('cantidadEmpleados', { valueAsNumber: true })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='100'
                  />
                  {errors.cantidadEmpleados && (
                    <p className='text-red-500 text-center'>{errors.cantidadEmpleados.message}</p>
                  )}
                </div>
                <div className='flex flex-col gap-1 '>
                  <p className='text-sm'>Ingresos anuales</p>

                  <div className='flex items-center border gap-2 border-[#D1D5DB] overflow-hidden rounded-md focus-within:border-black '>
                    <span className='text-[var(--font-title-light)] bg-[#D1D5DB] p-2'>$</span>
                    <input
                      type='number'
                      {...registerPyme('ingresosAnual', { valueAsNumber: true })}
                      className='w-full outline-none py-2'
                      placeholder='1000000'
                      min={0}
                    />
                    <span className='text-[#414141FF] bg-[#D1D5DB] p-2'>USD</span>
                  </div>

                  {errors.ingresosAnual && <p className='text-red-500 text-center'>{errors.ingresosAnual.message}</p>}
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
                    {...registerPyme('direccion')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Av.Corrientes 1234'
                  />
                  {errors.direccion && <p className='text-red-500 text-center'>{errors.direccion.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Ciudad</p>

                  <input
                    type='text'
                    {...registerPyme('ciudad')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Ciudad Autónoma de Buenos Aires'
                  />
                  {errors.ciudad && <p className='text-red-500 text-center'>{errors.ciudad.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Estado/Provincia</p>

                  <input
                    type='text'
                    {...registerPyme('provincia')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Caba'
                  />
                  {errors.provincia && <p className='text-red-500 text-center'>{errors.provincia.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Código postal</p>

                  <input
                    type='text'
                    {...registerPyme('codigoPostal')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='C1043AAS'
                  />
                  {errors.codigoPostal && <p className='text-red-500 text-center'>{errors.codigoPostal.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>País</p>

                  <input
                    type='text'
                    {...registerPyme('pais')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Argentina'
                  />
                  {errors.pais && <p className='text-red-500 text-center'>{errors.pais.message}</p>}
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
                  <p className='text-sm'>Teléfono</p>
                  <input
                    type='text'
                    {...registerPyme('telefono')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='+54 11 1234-5678'
                  />
                  {errors.telefono && <p className='text-red-500 text-center'>{errors.telefono.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Website (opcional)</p>
                  <input
                    type='text'
                    {...(registerPyme('website'), { required: false })}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='https://www.empresa.com'
                  />
                  {errors.website && <p className='text-red-500 text-center'>{errors.website.message}</p>}
                </div>
                <div className='flex flex-col gap-1 col-span-2'>
                  <p className='text-sm'>Descripción</p>
                  <textarea
                    rows={5}
                    {...registerPyme('descripcion')}
                    className='border min-h-30 max-h-60 p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Describe brevemente tu empresa...'
                  />
                  {errors.descripcion && <p className='text-red-500 text-center'>{errors.descripcion.message}</p>}
                </div>
              </div>
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
                value='Guardar Prefil'
              />
            )}
          </div>
        </form>
      </section>
      <Footer />
    </>
  )
}
