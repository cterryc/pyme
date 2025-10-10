import { useState } from 'react'
import { SignSingleDocument } from './SignSingleDocument'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import { IoIosAddCircleOutline, IoIosAddCircle } from 'react-icons/io'
import type { SignedPDF } from '@/interfaces/sign.interface'
import { TbTrashX } from 'react-icons/tb'

export const SignDocuments = ({ onSignDocument }: { onSignDocument: (signedPDFs: Array<SignedPDF>) => void }) => {
  const [PDFFiles, setPDFFiles] = useState<Array<File>>([])
  const [SignedPDFFiles, setSignedPDFFiles] = useState<Array<SignedPDF>>([])
  const [isSigningPDF, setIsSigningPDF] = useState(false)
  const [currentPDF, setCurrentPDF] = useState('')

  const removePDF = (name: string) => {
    setSignedPDFFiles((prev) => prev.filter((signedPDF) => signedPDF.docName !== name))
    setPDFFiles((prev) => prev.filter((pdf) => pdf.name !== name))
  }

  const signPDF = async (name: string) => {
    setIsSigningPDF(true)
    setCurrentPDF(name)
  }

  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      const newPDFFiles = [...PDFFiles]
      acceptedFiles.forEach((file) => {
        if (!PDFFiles.some((pdfFiles) => pdfFiles.name == file.name)) {
          newPDFFiles.push(file)
        }
      })
      setPDFFiles(newPDFFiles)
      // console.log('state', PDFFiles)
    },
    [PDFFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleSignedPDF = (data: SignedPDF): void => {
    setIsSigningPDF(false)
    const newSignedPDFFiles = Array.from(SignedPDFFiles)
    newSignedPDFFiles.unshift(data)
    setSignedPDFFiles(newSignedPDFFiles)

    //"Retorna" los documentos firmados.
    onSignDocument(newSignedPDFFiles)
    // console.log(newSignedPDFFiles)
  }

  return (
    <section className='grid md:grid-cols-2 py-10 content-start '>
      <div {...getRootProps()} className=' m-auto w-full max-w-[200px] aspect-square'>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className='flex flex-col p-5 w-50 items-center rounded-xl justify-around h-full text-center border border-dashed border-[#4cbd2f] bg-[#baf2ac] cursor-pointer '>
            <IoIosAddCircleOutline className='w-full h-[40%] text-[#4cbd2f]' />
            <div>
              <p className='text-xs'>documentos...</p>

              <p className='p-1 px-3 my-3 rounded-2xl text-[#2b701a] bg-[#9ed690]'>Suelta aquí </p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col p-5 w-50 items-center rounded-xl justify-around h-full text-center border border-dashed border-[var(--primary)] bg-[#eaf1f6] cursor-pointer hover:bg-white duration-150'>
            <IoIosAddCircle className='w-full h-[40%] text-[var(--primary)]' />
            <div>
              <p className='text-xs'>Arrastra y suelta tus archivos pdf o</p>
              <div className='p-1 my-3 rounded-2xl text-[var(--primary)] bg-[#beddee]'>Seleccionar archivos</div>
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-3  items-center'>
        <h2 className='text-xl mb-8 font-medium'>Documentos agregados :</h2>
        {PDFFiles.map((pdfFile, index) => {
          const signedPDFData = SignedPDFFiles.find((pdfSigned) => pdfSigned.docName == pdfFile.name)
          return !signedPDFData ? (
            <div
              key={index}
              className='flex gap-5 border-b-1 border-[#ccc]  justify-around items-center py-2  w-sm max-w-full'
            >
              <p className='overflow-hidden text-center text-ellipsis text-[var(--font-title-light)] font-medium'>
                {pdfFile.name.split('.pdf')[0]}
              </p>

              <button
                className='text-red-500 text-3xl cursor-pointer hover:text-[#8c060c]'
                onClick={(e) => {
                  e.preventDefault()
                  removePDF(pdfFile.name)
                }}
              >
                <TbTrashX />
              </button>

              <button
                className='bg-[var(--primary)] p-1 px-2 text-white text-center border border-[var(--primary)] rounded-md hover:bg-[#0972a6] duration-150 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault()
                  signPDF(pdfFile.name)
                }}
              >
                Firmar
              </button>
            </div>
          ) : (
            <div
              key={index}
              className='flex gap-5 border-b-1 border-[#ccc]  justify-around items-center py-2  w-sm max-w-full'
            >
              <p className='overflow-hidden text-center text-ellipsis text-[var(--font-title-light)] font-medium'>
                {pdfFile.name.split('.pdf')[0]}
              </p>
              <button
                className='text-red-500 text-3xl cursor-pointer hover:text-[#8c060c]'
                onClick={(e) => {
                  e.preventDefault()
                  removePDF(pdfFile.name)
                }}
              >
                <TbTrashX />
              </button>
              <a
                href={signedPDFData.urlPreview}
                target='blank_'
                className='bg-[#12b92f] p-1 px-2 text-white text-center rounded-md hover:bg-[#18912d] duration-150 cursor-pointer'
              >
                Revisar
              </a>
            </div>
          )
        })}
      </div>

      {isSigningPDF && (
        <SignSingleDocument
          pdfFile={PDFFiles.find((pdf) => pdf.name == currentPDF) ?? null}
          // onSuccess={(signedPDF) => {
          //   handleSignedPDF({ ...signedPDF })
          // }}
          onSuccess={handleSignedPDF}
        />
      )}
    </section>
  )
}
