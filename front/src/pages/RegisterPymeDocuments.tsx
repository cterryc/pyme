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
  const MAX_DOCUMENTS = 4
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
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
        <Header />

        <section className='w-full max-w-5xl py-8 my-6 sm:my-10 mx-auto text-center flex-1 px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-500'>
            <div className='inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4'>
              <svg className='w-8 h-8 sm:w-10 sm:h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
              </svg>
            </div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl mb-3 text-gray-800 font-bold'>
              Adjunta documentos de la PYME
            </h2>
            <p className='text-sm sm:text-base text-gray-600 max-w-2xl mx-auto'>
              Completa con la documentación necesaria para poder solicitar un crédito
            </p>
          </div>

          <form
            className='max-w-3xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col items-center p-6 sm:p-8 lg:p-10 gap-6 sm:gap-8 border border-gray-100'
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div
              onClick={() => {
                setOpenModal(true)
              }}
              className='w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-center justify-center cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group'
            >
              <QuestionIcon className='text-2xl sm:text-3xl text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform' />
              <p className='text-base sm:text-lg text-blue-700 font-semibold text-center sm:text-left'>
                ¿Qué documentos debo adjuntar?
              </p>
            </div>

            <div className='w-full max-w-2xl space-y-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-700'>Tus documentos</h3>
                <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
                  {documents.filter(d => d.file).length} de {MAX_DOCUMENTS}
                </span>
              </div>

              <ul className='flex flex-col gap-3 sm:gap-4'>
                {documents.map((docField, indx) => {
                  return (
                    <li 
                      className='group animate-in slide-in-from-left duration-300' 
                      key={indx}
                      style={{ animationDelay: `${indx * 50}ms` }}
                    >
                      <div className='flex gap-3 items-center'>
                        {docField.file != null ? (
                          <div className='flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 shadow-sm'>
                            <svg className='w-6 h-6 text-green-600 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            <div className='flex-1 min-w-0'>
                              <p className='text-xs sm:text-sm text-green-700 font-medium mb-1'>Documento adjunto</p>
                              <p className='text-sm sm:text-base text-gray-900 font-semibold truncate'>{docField.file.name}</p>
                            </div>
                          </div>
                        ) : (
                          <label className='flex-1 relative cursor-pointer group/file'>
                            <div className='border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 flex items-center gap-3'>
                              <svg className='w-6 h-6 text-gray-400 group-hover/file:text-blue-500 transition-colors flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                              </svg>
                              <div className='flex-1 min-w-0 text-left'>
                                <p className='text-sm sm:text-base text-gray-700 font-medium'>
                                  Click para subir documento
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>PDF únicamente</p>
                              </div>
                            </div>
                            <input
                              type='file'
                              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                              accept='.pdf'
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                if (file) {
                                  handleFileChange(docField.id, file)
                                }
                              }}
                            />
                          </label>
                        )}
                        
                        <button
                          type='button'
                          onClick={() => {
                            removeDocInput(docField.id)
                          }}
                          disabled={documents.length <= 1}
                          className='flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group-hover:scale-105'
                          aria-label='Eliminar documento'
                        >
                          <TrashIcon className='text-xl sm:text-2xl' />
                        </button>
                      </div>
                    </li>
                  )
                })}

                {documents.length < MAX_DOCUMENTS && (
                  <li className='animate-in fade-in duration-300'>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault()
                        addDocInput()
                      }}
                      className='w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-3 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group/add'
                    >
                      <AddIcon className='text-3xl text-gray-400 group-hover/add:text-green-600 transition-colors' />
                      <span className='text-gray-600 group-hover/add:text-green-700 font-medium'>
                        Agregar otro documento
                      </span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4'>
              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/panel')
                }}
                className='flex-1 bg-white border-2 border-red-300 text-red-600 py-3 px-6 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={isPending}
                className='flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isPending ? (
                  <>
                    <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                    </svg>
                    <span>Enviar documentos</span>
                  </>
                )}
              </button>
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
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-green-50'>
        <Header />
        
        <section className='flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 lg:py-20'>
          <div className='text-center mb-8 sm:mb-12 animate-in fade-in zoom-in duration-500'>
            <div className='inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6 animate-bounce'>
              <svg className='w-10 h-10 sm:w-12 sm:h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-bold mb-3'>
              ¡Documentos enviados exitosamente!
            </h3>
            <p className='text-sm sm:text-base text-gray-600'>
              Tus documentos han sido cargados correctamente
            </p>
          </div>

          <div className='w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
            <div className='flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100'>
              <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <h4 className='text-xl font-bold text-gray-800'>Documentos cargados</h4>
              <span className='ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>
                {uploadDocuments.length} {uploadDocuments.length === 1 ? 'documento' : 'documentos'}
              </span>
            </div>

            <ul className='space-y-3'>
              {uploadDocuments.map((doc, i) => {
                return (
                  <li 
                    className='group animate-in slide-in-from-right duration-300' 
                    key={i}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200'>
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                          <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                          </svg>
                        </div>
                        <span className='font-semibold text-gray-800 truncate text-sm sm:text-base'>{doc.fileName}</span>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                        </svg>
                        <span>Ver documento</span>
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            className='mt-8 sm:mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group'
            onClick={() => {
              navigate('/panel')
            }}
          >
            <svg className='w-5 h-5 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            <span>Volver al panel</span>
          </button>
        </section>

        <Footer />
      </div>
    )
  }
}
