import { Header } from '@/components/Header'
import { IoMdTrash, IoMdAddCircle } from 'react-icons/io'
import { BsQuestionCircle } from 'react-icons/bs'
import { Footer } from '@/components/Footer'
import { DocumentList } from '@/components/DocumentsList'
import { Modal } from '@/components/Modals/Modal'
import { useState } from 'react'
import { toast } from 'sonner'
import { usePymeRegisterDocuments } from '@/hooks/usePyme'
import { useNavigate, useParams } from 'react-router-dom'
import type { DocumentResponse } from '@/interfaces/pyme.interface'

const TrashIcon = IoMdTrash
const AddIcon = IoMdAddCircle
const QuestionIcon = BsQuestionCircle

interface DocumentField {
  id: string
  file: File | null
}

export const RegisterPymeDocuments = () => {
  const MAX_DOCUMENTS = 5
  const navigate = useNavigate()
  const { id: pymeID } = useParams<{ id: string }>()

  const [openModal, setOpenModal] = useState(false)

  const [documents, setDocuments] = useState<DocumentField[]>([{ id: `doc_${Date.now()}`, file: null }])
  const [uploadDocuments, setUploadDocuments] = useState<DocumentResponse[]>([])

  const {
    mutate: pymeRegisterDocuments,
    isPending
    // isError,
    // error
  } = usePymeRegisterDocuments({
    onSuccess: (data) => {
      toast.success('¡Documentos guardados exitosamente!', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Tu MYPE está completamente registrada. Ya puedes solicitar un crédito.',
        duration: 4000
      })
      // console.log(data.payload.documents)
      setUploadDocuments(data.payload.documents)
    },
    onError: (data) => {
      toast.error('Error al subir los documentos', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        // description: `${data.payload[0].message}`,
        description:
          `${data.payload.message}` ||
          'No se pudieron cargar los documentos. Verifica que estén firmados correctamente.',
        duration: 4000
      })
    }
  })

  const addDocInput = () => {
    if (documents.length >= MAX_DOCUMENTS) return

    const newDocInput: DocumentField = {
      id: `doc_${Date.now()}`,
      file: null
    }

    setDocuments((prev) => [...prev, newDocInput])
  }
  const removeDocInput = (docId: string) => {
    if (documents.length <= 1) return
    setDocuments((prev) => prev.filter((doc) => doc.id != docId))
  }

  const handleFileChange = (docId: string, file: File) => {
    const isDuplicated = documents.some((d) => d.file?.name == file.name)
    if (isDuplicated) {
      toast.info(`Documento repetido`, {
        style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
        duration: 2500
      })
      return
    }
    setDocuments((prev) => prev.map((doc) => (doc.id == docId ? { id: docId, file: file } : doc)))
  }

  const handleSubmit = () => {
    console.log('submit')

    const formData = new FormData()
    documents.forEach((doc) => {
      if (doc.file) {
        formData.append('files', doc.file)
      }
    })

    if (formData.getAll('files').length < 1) {
      toast.info(`Debes adjuntar al menos un documento`, {
        style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
        duration: 2500
      })
      return
    }
    formData.set('companyId', pymeID ?? '')
    formData.set('type', 'Tax Return')

    // console.log('Enviar', formData.getAll('files'), formData.get('type'), formData.get('companyId'))

    pymeRegisterDocuments(formData)
  }

  if (uploadDocuments.length == 0) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />

        <section className='w-full max-w-7xl py-5 my-10 m-auto text-center flex-1 p-2'>
          <h2 className='text-3xl my-3 text-[var(--font-title-light)] font-medium'>Adjunta documentos de la PYME</h2>
          <p>Completa con la documentación necesaria para poder solicitar un crédito</p>

          <form
            className='max-w-2xl mx-auto rounded-md flex flex-col items-center p-10 gap-10'
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <p
              onClick={() => {
                setOpenModal(true)
              }}
              className='flex gap-3 p-4 border border-dashed rounded-md items-center text-xl text-[var(--primary)] font-medium text-center cursor-pointer hover:text-[#1879a9] duration-150'
            >
              ¿Que documentos debo adjuntar?
              <QuestionIcon />
            </p>

            <ul className='flex flex-col gap-5 w-full max-w-md'>
              {documents.map((docField, indx) => {
                return (
                  <li className='flex gap-3 items-center relative' key={indx}>
                    {docField.file != null ? (
                      <div className='border-b-1 border-[#999] p-1 w-full text-ellipsis overflow-hidden'>
                        Documento adjunto: {docField.file.name}
                      </div>
                    ) : (
                      <input
                        type='file'
                        className='border border-[#999] p-1 rounded-md w-full cursor-pointer hover:bg-[#ddd]'
                        accept='.pdf'
                        placeholder='Sube tu documento'
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (file) {
                            handleFileChange(docField.id, file)
                          }
                        }}
                      />
                    )}
                    <TrashIcon
                      onClick={() => {
                        removeDocInput(docField.id)
                      }}
                      className='text-red-600 absolute text-3xl left-full cursor-pointer hover:text-red-800 duration-150'
                    />
                  </li>
                )
              })}

              <li
                className='bg-lime-600 flex justify-center px-10 self-center p-1 rounded-md cursor-pointer hover:bg-lime-700 duration-150'
                onClick={(e) => {
                  e.preventDefault()
                  addDocInput()
                }}
              >
                <AddIcon className='text-3xl text-lime-500'></AddIcon>
              </li>
            </ul>
            <div className='flex justify-around w-full my-15'>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/panel')
                }}
                className='bg-red-500 text-white p-2 px-4 rounded-md hover:bg-red-600 duration-150 cursor-pointer'
              >
                Cancelar
              </button>
              <input
                type='submit'
                value='Enviar'
                className='bg-[var(--primary)] text-white p-2 px-4 rounded-md hover:bg-[#1477a9] duration-150 cursor-pointer'
                disabled={isPending}
              />
            </div>
          </form>
        </section>
        <Modal
          enable={openModal}
          onClose={() => {
            setOpenModal(false)
          }}
        >
          <DocumentList />
        </Modal>
        <Footer />
      </div>
    )
  } else {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />
        <section className='flex-1 flex flex-col gap-20 items-center pt-20'>
          <h3 className='text-2xl text-[var(--font-title-light)] font-medium'>Documentos subidos</h3>
          <ul className='p-5 max-w-md w-full flex flex-col gap-4'>
            {uploadDocuments.map((doc, i) => {
              return (
                <li className='flex justify-between items-center border-b-1 border-[#bbb] p-2 px-3 ' key={i}>
                  <span className='font-medium overflow-hidden text-ellipsis'>{doc.fileName}</span>
                  <a
                    href={doc.fileUrl}
                    target='_blank'
                    className='bg-lime-600 text-white p-2 rounded cursor-pointer hover:bg-lime-700 duration-150'
                  >
                    Revisar
                  </a>
                </li>
              )
            })}
          </ul>
          <button
            className='bg-[var(--primary)] px-4 p-2 text-white rounded-md cursor-pointer hover:bg-[#1471a0] duration-150 '
            onClick={() => {
              navigate('/panel')
            }}
          >
            Volver al panel
          </button>
        </section>
        <Footer />
      </div>
    )
  }
}
