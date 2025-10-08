import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerPymeSchema, type RegisterPymeFormData } from '@/schemas/pyme.schema'
import { zodResolver } from '@hookform/resolvers/zod'
// import { TbTrashX } from 'react-icons/tb'
// import { SignDocuments } from '@/components/SignDocuments'
// import { SignSingleDocument } from '@/components/SignSingleDocument'
// import type { SignedPDF } from '@/interfaces/sign.interface'
import { usePymeRegister } from '@/hooks/usePyme'
import { ImSpinner9 } from 'react-icons/im'

export const RegisterPyme = () => {
  const maxStep = 3
  const [step, setStep] = useState(0) //useState(4)
  // const [isOwner, setIsOwner] = useState(false)
  // const [notarialPDF, setNotarialPDF] = useState<File | null>(null)
  // const [signedPDFs, setSignedPDFs] = useState<Array<SignedPDF>>([])
  // const [notarialSignedPDF, setNotarialSignedPDF] = useState<SignedPDF | null>(null)

  const {
    mutate: pymeRegister,
    isPending,
    isError,
    error
  } = usePymeRegister({
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const {
    register: registerPyme,
    // setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeFormData>({
    resolver: zodResolver(registerPymeSchema)
  })

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setStep(0)
    }
  }, [errors, setStep])

  // useEffect(() => {
  //   const signedPDFToSend: Array<{ data: ArrayBuffer; sign: ArrayBuffer }> = []
  //   signedPDFs.forEach((signedPDF) => {
  //     // const data:{ data: ArrayBuffer; sign: ArrayBuffer } = {}
  //     const value = { data: signedPDF.pdfBytes, sign: signedPDF.imageBytes }
  //     signedPDFToSend.push(value)
  //   })
  //   setValue('pymeData.documents', signedPDFToSend)
  // }, [notarialSignedPDF, signedPDFs, setValue])

  const onSubmit = (data: RegisterPymeFormData) => {
    // if (!data.isOwner && notarialSignedPDF == null) {
    //   alert('Debes adjuntar y firmar el poder notarial')
    //   return
    // }
    // console.log(data.pymeData.documents)
    console.log(data)
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

  // const handleNotarialPDFSign = () => {
  //   console.log('FIRMAR PDF NOTARIAL')
  // }

  // const handleSignedDocuments = (newSignedPDFs: Array<SignedPDF>) => {
  //   const currentSignedPDFs = [...signedPDFs]
  //   newSignedPDFs.forEach((newPDF) => {
  //     if (!currentSignedPDFs.find((pdf) => pdf.name == newPDF.name)) {
  //       currentSignedPDFs.push(newPDF)
  //     }
  //   })
  //   setSignedPDFs(currentSignedPDFs)
  //   // console.log('LOS PDFS FIRMADOS ACTUALMENTE SON : ', currentSignedPDFs)
  // }

  return (
    <>
      <Header avatar={''} />
      {/* TEMPORAL */}
      {isError && (
        <div className='text-5xl text-red-500'>
          <p>{error.error}</p>
          <p>{error.message}</p>
        </div>
      )}
      {/* TEMPORAL */}

      <section className='w-full max-w-7xl py-5 my-10 m-auto text-center'>
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
                {/* <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Nombre dueño</p>

                  <input
                    {...registerPyme('ownerName')}
                    type='text'
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Nombre del titular de la empresa'
                    style={{ borderColor: errors.ownerName ? 'red' : '' }}
                  />
                  {errors.ownerName && <p className='text-red-500 text-center'>{errors.ownerName.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Apellido dueño</p>

                  <input
                    type='text'
                    {...registerPyme('ownerSurname')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='Apellido del titular de la empresa'
                    style={{ borderColor: errors.ownerSurname ? 'red' : '' }}
                  />
                  {errors.ownerSurname && <p className='text-red-500 text-center'>{errors.ownerSurname.message}</p>}
                </div> */}
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
                {/* <div className='flex flex-col gap-1'>
                  <p className='text-sm'>Teléfono de propietario</p>
                  <input
                    type='text'
                    {...registerPyme('ownerPhone')}
                    className='border p-2 border-[#D1D5DB] rounded-md'
                    placeholder='+54 11 1234-5678'
                    style={{ borderColor: errors.pymeData?.contact?.phone ? 'red' : '' }}
                  />
                  {errors.pymeData?.contact?.ownerPhone && (
                    <p className='text-red-500 text-center'>{errors.pymeData?.contact?.ownerPhone.message}</p>
                  )}
                </div> */}
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
          {/* {step == 4 && (
            <div>
              <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
                Documentación
              </h3>

              <div className='flex flex-col  xl:flex-row gap-2 justify-around items-center border-2 border-[var(--primary)] border-dashed rounded-md py-3'>
                <div className='flex flex-col sm:flex-row items-center gap-3'>
                  <p className='text-lg'>Es el dueño de la pyme?</p>
                  <input
                    type='checkbox'
                    className='cursor-pointer w-5'
                    {...registerPyme('isOwner')}
                    onChange={(e) => {
                      setIsOwner(e.target.checked)
                    }}
                  />
                </div>

                {!isOwner && (
                  <div className='flex flex-col gap-2 p-5'>
                    <p className='text-sm'>Poder Notarial con Facultades para Endeudamiento:</p>
                    {
                      notarialPDF == null ? (
                        <input
                          accept='.pdf'
                          disabled={notarialPDF != null}
                          type='file'
                          className='border p-2 border-[#D1D5DB] rounded-md w-full'
                          onChange={(e) => {
                            const pdfFile = e.target.files?.[0]
                            if (pdfFile && pdfFile.type == 'application/pdf') {
                              setNotarialPDF(pdfFile)
                            } else {
                              setNotarialPDF(null)
                            }
                          }}
                        />
                      ) : (
                        <div className='flex items-center gap-1 justify-around'>
                          <p className='text-[var(--font-title-light)] font-medium'>{notarialPDF.name}</p>
                          {notarialSignedPDF != null ? (
                            <a
                              target='blank_'
                              href={notarialSignedPDF.urlPreview}
                              className='px-3 border border-[var(--primary)] rounded-md text-white bg-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
                            >
                              Revisar
                            </a>
                          ) : (
                            <button
                              className='px-3 border border-[var(--primary)] rounded-md text-white bg-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
                              // onClick={(e) => {
                              //   e.preventDefault()
                              //   handleNotarialPDFSign()
                              // }}
                            >
                              Firmar
                            </button>
                          )}
                          <button
                            className='text-red-500 text-3xl cursor-pointer hover:text-[#8c060c]'
                            onClick={(e) => {
                              e.preventDefault()
                              setNotarialPDF(null)
                              setNotarialSignedPDF(null)
                            }}
                          >
                            <TbTrashX />
                          </button>
                        </div>
                        // {!errors.website && <p className='text-red-500 text-center'>{'errors.website.message'}</p>}
                      )
                      // </div>
                    }
                  </div>
                )}
              </div>
              <div className='border-2 border-[var(--primary)] border-dashed my-3 sm:p-5 rounded-md'>
                <SignDocuments onSignDocument={handleSignedDocuments} />
              </div>
            </div>
          )} */}

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
        {/* {notarialPDF != null && notarialSignedPDF == null && (
          <SignSingleDocument
            pdfFile={notarialPDF}
            onSuccess={(signedPDF) => {
              const newSignedPDFFiles = [...signedPDFs]
              newSignedPDFFiles.push(signedPDF)
              setNotarialSignedPDF(signedPDF)
              setSignedPDFs(newSignedPDFFiles)
              console.log(newSignedPDFFiles)
            }}
          />
        )} */}
        {isPending && (
          <div className='fixed w-[100vw] top-[0] left-[0] h-[100vh] bg-[rgba(0,0,0,.9)]'>
            <div className='flex flex-col gap-15 items-center text-5xl mt-30 text-white'>
              <span>Cargando ...</span>
              <ImSpinner9 className='w-[200px] h-[200px] animate-spin' />
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
