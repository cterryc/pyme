import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Header } from '@/components/Header'
import { TbTrashX } from 'react-icons/tb'
import { LuHardDriveUpload } from 'react-icons/lu'
import { SignDocuments } from '@/components/SignDocuments'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignSingleDocument } from '@/components/SignSingleDocument'
import type { SignedPDF } from '@/interfaces/sign.interface'
import { usePymeRegisterDocuments } from '@/hooks/usePyme'
import { registerPymeDocumentsSchema, type RegisterPymeDocumentsFormData } from '@/schemas/pyme.schema'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

export const RegisterPymeDocuments = () => {
  const [isOwner, setIsOwner] = useState(false)
  const [notarialPDF, setNotarialPDF] = useState<File | null>(null)
  const [signedPDFs, setSignedPDFs] = useState<Array<SignedPDF>>([])
  const [notarialSignedPDF, setNotarialSignedPDF] = useState<SignedPDF | null>(null)
  const { id: pymeID } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    mutate: pymeRegisterDocuments,
    isPending,
    isError,
    error
  } = usePymeRegisterDocuments({
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (data) => {
      console.log(data)
      //Toast.error con data.payload.message
    }
  })

  useEffect(() => {
    if (isPending) {
      toast.loading('Subiendo archivos...', { duration: 4000 })
    }
  }, [isPending])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeDocumentsFormData>({
    resolver: zodResolver(registerPymeDocumentsSchema)
  })
  useEffect(() => {
    const signedPDFToSend: Array<{ docName: string; data: ArrayBuffer; sign: ArrayBuffer }> = []
    signedPDFs.forEach((signedPDF) => {
      // const data:{ data: ArrayBuffer; sign: ArrayBuffer } = {}
      const value = { docName: signedPDF.docName ?? 'document', data: signedPDF.pdfBytes, sign: signedPDF.imageBytes }
      signedPDFToSend.push(value)
    })
    setValue('documents', signedPDFToSend)
  }, [notarialSignedPDF, signedPDFs, setValue])

  const handleSignedDocuments = (newSignedPDFs: Array<SignedPDF>) => {
    const currentSignedPDFs = [...signedPDFs]
    newSignedPDFs.forEach((newPDF) => {
      if (!currentSignedPDFs.find((pdf) => pdf.docName == newPDF.docName)) {
        currentSignedPDFs.push(newPDF)
      }
    })
    setSignedPDFs(currentSignedPDFs)
    // console.log('LOS PDFS FIRMADOS ACTUALMENTE SON : ', currentSignedPDFs)
  }

  const onSubmit = (data: RegisterPymeDocumentsFormData) => {
    if (!data.isOwner && notarialSignedPDF == null) {
      toast.error('', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'Debes adjuntar y firmar el poder notarial si no eres el dueño de la pyme.',
        duration: 4000
      })
      return
    }

    if (!pymeID) {
      toast.error('ERROR')
      return
    }

    //Form data para enviar;

    const formData = new FormData()

    data.documents.forEach((doc) => {
      const pdfBlob = new Blob([doc.data], { type: 'application/pdf' })
      // const signBlob = new Blob([doc.sign], { type: 'image/png' })

      formData.append('files', pdfBlob, doc.docName.split('.')[0])
      // formData.append('files', signBlob, doc.docName.split('.')[0])
    })
    formData.set('companyId', '23ee4f1c-64f9-4d7c-bf0d-5b278d670c8d')
    formData.set('type', 'Tax Return')

    pymeRegisterDocuments(formData)
  }

  return (
    <>
      <Header />
      {isError && <h1 className='text-8xl text-red-500'>{error.payload.message}</h1>}
      <section className='w-full max-w-7xl py-5 my-10 m-auto text-center'>
        <h2 className='text-3xl my-3 text-[var(--font-title-light)] font-medium'>Adjunta documentos de la PYME</h2>
        <p>Completa con la documentación necesaria para poder solicitar un crédito</p>
        <form className='flex flex-col text-left px-10 md:px-20 mt-5' onSubmit={handleSubmit(onSubmit)}>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] py-2 mb-5'>
            Documentación
          </h3>

          {/* <div className='flex flex-col  xl:flex-row gap-2 justify-around items-center border-2 border-[var(--primary)] border-dashed rounded-md py-3'> */}
          <div className='flex flex-col  my-5 border-b-1 border-[#ccc] xl:flex-row gap-2 justify-around items-center  py-3'>
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
              <div className='flex flex-col items-around gap-2 max-w-sm w-full'>
                <p className='text-sm text-center'>Poder Notarial con Facultades para Endeudamiento:</p>
                {notarialPDF == null ? (
                  <label className='self-center'>
                    <LuHardDriveUpload className='text-3xl text-[#12b92f] hover:text-[#18912d] duration-150 cursor-pointer' />
                    <input
                      accept='.pdf'
                      disabled={notarialPDF != null}
                      type='file'
                      className='border p-2 border-[#D1D5DB] rounded-md w-full hidden'
                      onChange={(e) => {
                        const pdfFile = e.target.files?.[0]
                        if (pdfFile && pdfFile.type == 'application/pdf') {
                          setNotarialPDF(pdfFile)
                        } else {
                          setNotarialPDF(null)
                        }
                      }}
                    />
                  </label>
                ) : (
                  <div className='flex items-center gap-1 justify-around'>
                    <p className='overflow-hidden text-center text-ellipsis text-[var(--font-title-light)] font-medium'>
                      {notarialPDF.name.split('.pdf')[0]}
                    </p>
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
                    {notarialSignedPDF != null ? (
                      <a
                        target='blank_'
                        href={notarialSignedPDF.urlPreview}
                        className='bg-[#12b92f] p-1 px-2 text-white text-center rounded-md hover:bg-[#18912d] duration-150 cursor-pointer'
                      >
                        Revisar
                      </a>
                    ) : (
                      <button className='bg-[var(--primary)] p-1 px-2 text-white text-center rounded-md hover:bg-[#0972a6] duration-150 cursor-pointer'>
                        Firmar
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <div className='border-2 border-[var(--primary)] border-dashed my-3 sm:p-5 rounded-md'> */}
          <div className='my-3 sm:p-5 rounded-md '>
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
