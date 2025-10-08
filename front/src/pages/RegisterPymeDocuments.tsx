import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Header } from '@/components/Header'
import { TbTrashX } from 'react-icons/tb'
import { SignDocuments } from '@/components/SignDocuments'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignSingleDocument } from '@/components/SignSingleDocument'
import type { SignedPDF } from '@/interfaces/sign.interface'
import { usePymeRegisterDocuments } from '@/hooks/usePyme'
import { registerPymeDocumentsSchema, type RegisterPymeDocumentsFormData } from '@/schemas/pyme.schema'
import { useNavigate, useParams } from 'react-router-dom'
import { ImSpinner9 } from 'react-icons/im'

export const RegisterPymeDocuments = () => {
  const [isOwner, setIsOwner] = useState(false)
  const [notarialPDF, setNotarialPDF] = useState<File | null>(null)
  const [signedPDFs, setSignedPDFs] = useState<Array<SignedPDF>>([])
  const [notarialSignedPDF, setNotarialSignedPDF] = useState<SignedPDF | null>(null)
  const { id: pymeID } = useParams<{ id: string }>()

  // useEffect(() => {
  //   setPymeID(id)

  // }, [])

  const {
    mutate: pymeRegisterDocuments,
    isPending,
    isError,
    error
  } = usePymeRegisterDocuments({
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeDocumentsFormData>({
    resolver: zodResolver(registerPymeDocumentsSchema)
  })
  const navigate = useNavigate()
  useEffect(() => {
    const signedPDFToSend: Array<{ data: ArrayBuffer; sign: ArrayBuffer }> = []
    signedPDFs.forEach((signedPDF) => {
      // const data:{ data: ArrayBuffer; sign: ArrayBuffer } = {}
      const value = { data: signedPDF.pdfBytes, sign: signedPDF.imageBytes }
      signedPDFToSend.push(value)
    })
    setValue('documents', signedPDFToSend)
  }, [notarialSignedPDF, signedPDFs, setValue])

  const handleSignedDocuments = (newSignedPDFs: Array<SignedPDF>) => {
    const currentSignedPDFs = [...signedPDFs]
    newSignedPDFs.forEach((newPDF) => {
      if (!currentSignedPDFs.find((pdf) => pdf.name == newPDF.name)) {
        currentSignedPDFs.push(newPDF)
      }
    })
    setSignedPDFs(currentSignedPDFs)
    console.log('LOS PDFS FIRMADOS ACTUALMENTE SON : ', currentSignedPDFs)
  }

  const onSubmit = (data: RegisterPymeDocumentsFormData) => {
    if (!data.isOwner && notarialSignedPDF == null) {
      alert('Debes adjuntar y firmar el poder notarial')
      return
    }
    console.log(data)
    pymeRegisterDocuments(data)
  }

  return (
    <>
      <Header avatar={''} />
      <button
        onClick={() => {
          console.log(pymeID)
        }}
      >
        TEST ONLY
      </button>
      <section className='w-full max-w-7xl py-5 my-10 m-auto text-center'>
        <h2 className='text-3xl my-3 text-[var(--font-title-light)] font-medium'>Adjunta documentos de la PYME</h2>
        <p>Completa con la documentación necesaria para poder solicitar un crédito</p>
        <form className='flex flex-col text-left px-10 md:px-20 mt-5' onSubmit={handleSubmit(onSubmit)}>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] py-2 mb-5'>
            Documentación
          </h3>

          <div className='flex flex-col  xl:flex-row gap-2 justify-around items-center border-2 border-[var(--primary)] border-dashed rounded-md py-3'>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <p className='text-lg'>Es el dueño de la pyme?</p>
              <input
                type='checkbox'
                className='cursor-pointer w-5'
                {...register('isOwner')}
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

          <div className='flex text-center justify-between px-10 md:px-20 mt-20'>
            <button
              className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
              onClick={() => {
                navigate('/Dashboard/')
              }}
            >
              Cancelar
            </button>

            <input
              type='submit'
              className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
              value='Guardar'
            />
          </div>
        </form>
        {notarialPDF != null && notarialSignedPDF == null && (
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
        )}
        {isPending && (
          <div className='fixed w-[100vw] top-[0] left-[0] h-[100vh] bg-[rgba(0,0,0,.9)]'>
            <div className='flex flex-col gap-15 items-center text-5xl mt-30 text-white'>
              <span>Cargando ...</span>
              <ImSpinner9 className='w-[200px] h-[200px] animate-spin' />
            </div>
          </div>
        )}
      </section>

      {/* TEMP */}
      <div>
        {errors.isOwner && <p className='text-5xl text-red-500'>Error en isOwner {errors.isOwner?.message}</p>}
        {errors.documents && <p className='text-5xl text-red-500'>Error en documents {errors.documents.message}</p>}
      </div>
      {/* TEMP */}
    </>
  )
}
