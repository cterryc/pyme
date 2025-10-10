import { PDFDocument, rgb } from 'pdf-lib'
import { useState, useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { ImSpinner9 } from 'react-icons/im'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import type { SignedPDF } from '@/interfaces/sign.interface'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

type PDFImagesProcessed = { image: string; width: number; height: number; num: number }
// type SignedPDF = { imageBytes: ArrayBuffer; pdfBytes: ArrayBuffer; urlPreview: string; name?: string }

export const SignSingleDocument = ({
  pdfFile,
  onSuccess
}: {
  pdfFile: File | null
  onSuccess: (res: SignedPDF) => void
}) => {
  const scaleFactor = 1.8

  const [isLoading, setIsLoading] = useState(true)
  const [pdfImages, setPDFImages] = useState<Array<PDFImagesProcessed>>([])
  const [pdfName, setPDFName] = useState('')

  useEffect(() => {
    const processPDF = async () => {
      const pdfImagesProcessed = await convertirPDFaImagenes(pdfFile)
      setPDFImages(pdfImagesProcessed)
      setIsLoading(false)
    }
    if (pdfFile) {
      processPDF()
    }
  }, [pdfFile])

  const handleSigned = (pdfSigned: SignedPDF) => {
    onSuccess({ ...pdfSigned, docName: pdfName })
  }

  const convertirPDFaImagenes = async (file: File | null): Promise<Array<PDFImagesProcessed>> => {
    if (file == null) {
      alert('Error a cargar el pdf')
      return []
    }
    const arrayBuffer = await file.arrayBuffer()
    setPDFName(file.name)
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const cantidadPaginas = pdf.numPages
    const images = []
    for (let i = 1; i <= cantidadPaginas; i++) {
      const pag = await pdf.getPage(i)

      const viewport = pag.getViewport({ scale: scaleFactor })
      // const viewport = pag.getViewport({ scale: 1.8 })
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height

      await pag.render({
        canvas: canvas,
        canvasContext: ctx ?? undefined,
        viewport: viewport
      }).promise

      images.push({
        image: canvas.toDataURL('image/png'),
        width: viewport.width,
        height: viewport.height,
        num: i
      })
    }
    return images
  }

  return (
    <article className='fixed flex justify-center top-[0] left-[0] w-[100vw] h-[100vh] py-5 bg-[rgba(0,0,0,.4)]'>
      {isLoading ? (
        <div className='flex flex-col gap-15 items-center text-5xl mt-30 text-white'>
          <span>Cargando ...</span>
          <ImSpinner9 className='w-[200px] h-[200px] animate-spin' />
        </div>
      ) : (
        <div className='-bg-[var(--bg-light)] p-5 w-full overflow-y-scroll max-w-7xl select-none '>
          {/* pdf view */}
          <div className='flex flex-col gap-10 max-w-6xl items-center'>
            {pdfImages.map((image, index) => {
              if (index < pdfImages.length - 1) {
                return <img key={index} src={image.image} alt={`Página ${index + 1} del documento`} />
              } else {
                return (
                  <div key={index} className='relative'>
                    <img src={image.image} alt={`Página ${index + 1} del documento`} />
                    <SignFrame scaleFactor={scaleFactor} pdfFile={pdfFile} onSigned={handleSigned} />
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
    </article>
  )
}

const SignFrame = ({
  scaleFactor = 1.8,
  pdfFile,
  onSigned
}: {
  scaleFactor: number
  pdfFile: File | null
  onSigned: (res: SignedPDF) => void
}) => {
  // const scaleFactor = 1.8
  const initialWidth = 230
  const initialHeight = 161
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signDraw, setSignDraw] = useState('')

  if (pdfFile == null) {
    const res: SignedPDF = { imageBytes: new ArrayBuffer(), pdfBytes: new ArrayBuffer(), urlPreview: '' }
    alert('Error al intentar firmar')
    onSigned(res)
  }

  const initSign = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const rect = canvas.getBoundingClientRect()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.beginPath()

    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'
    setIsDrawing(true)
  }

  const doSign = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const rect = canvas.getBoundingClientRect()

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }
  const endSign = () => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    setSignDraw(canvas.toDataURL('image/png'))
    setIsDrawing(false)
  }
  const clearSign = () => {
    // e.preventDefault()
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignDraw('')
  }
  const handleResizeStop = () => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }

  const buildPdfWithSign = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (signDraw == '') {
      alert('Debes firmar el pdf antes de enviarlo')
      return
    }
    if (pdfFile == null) {
      alert('Error al intentar firmar')
      return
    }

    //pdfOriginal
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    //obtener imagen de firma
    const signImagebase64 = signDraw.replace(/^data:image\/png;base64,/, '')
    const binarySign = atob(signImagebase64)

    const signImageBytes = new Uint8Array(binarySign.length)

    for (let i = 0; i < binarySign.length; i++) {
      signImageBytes[i] = binarySign.charCodeAt(i)
    }

    // const signImageBytes = Buffer.from(signImagebase64, 'base64')
    const signImage = await pdfDoc.embedPng(signImageBytes)

    const pages = pdfDoc.getPages()
    const lastPage = pages[pages.length - 1]

    //calculo coordenadas en pdf usando coords en viewport;
    const { height: pageHeight } = lastPage.getSize()
    const containerRect = (containerRef.current as unknown as HTMLDivElement).getBoundingClientRect()
    const canvasRect = (canvasRef.current as unknown as HTMLCanvasElement).getBoundingClientRect()
    const signYFixed = canvasRect.y - containerRect.y + canvasRect.height

    //coords pdf;
    const signX = (canvasRect.x - containerRect.x) / scaleFactor
    const signY = pageHeight - signYFixed / scaleFactor

    lastPage.drawImage(signImage, {
      x: signX,
      y: signY,
      width: canvasRect.width / scaleFactor,
      height: canvasRect.height / scaleFactor
    })

    const signDate = new Date().toLocaleDateString('es-ES')
    lastPage.drawText(`Firmado el ${signDate}`, {
      x: 20,
      y: 20,
      size: 10,
      color: rgb(0, 0, 0)
    })

    const signPDFBytes = await pdfDoc.save()
    const SignPDFarrayBuffer = signPDFBytes.buffer as ArrayBuffer

    const pdfBlob = new Blob([SignPDFarrayBuffer], { type: 'application/pdf' })

    //Para pre visualizar
    const urlPreview = URL.createObjectURL(pdfBlob)

    const response: SignedPDF = {
      imageBytes: signImageBytes.buffer,
      pdfBytes: SignPDFarrayBuffer,
      urlPreview: urlPreview
    }

    onSigned(response)
  }

  return (
    <div ref={containerRef} className='absolute top-[0] left-[0] w-full h-[100%]'>
      <Rnd
        default={{
          x: 300,
          y: 150,
          width: initialWidth,
          height: initialHeight
        }}
        // onResizeStop={() => {
        //   const canvas = canvasRef.current
        //   const rect = canvas.getBoundingClientRect()
        //   canvas.width = rect.width
        //   canvas.height = rect.height
        // }}
        onResizeStop={handleResizeStop}
        minWidth={260}
        maxWidth={500}
        lockAspectRatio={1.6180339887}
        bounds='parent'
        dragHandleClassName='drag-handle'
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: false,
          topRight: true,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
        style={{
          display: 'flex',
          position: 'absolute'
        }}
      >
        {/*Barra de la izquierda */}
        <div className='drag-handle w-[30px] bg-[var(--primary)] cursor-grab hover:bg-[#0d6794] duration-150'></div>

        {/* Contenido del div */}
        <div className='relative'>
          <canvas
            className='w-full h-full bg-[rgba(0,0,0,.1)]'
            // className='max-w-full border border-[red]'
            ref={canvasRef}
            onMouseDown={initSign}
            onMouseMove={doSign}
            onMouseUp={endSign}
            onMouseLeave={endSign}
          ></canvas>
          <div className='flex gap-3 justify-between  w-full absolute top-[-70px]'>
            <button
              onClick={clearSign}
              className='bg-[var(--primary)] border border-[var(--primary)] text-white rounded-md p-2 hover:bg-[#0d6794] duration-150 cursor-pointer'
            >
              Limpiar firma
            </button>
            <button
              onClick={buildPdfWithSign}
              className='bg-[var(--primary)] border border-[var(--primary)] text-white rounded-md p-2 hover:bg-[#0d6794] duration-150 cursor-pointer'
            >
              Firmar
            </button>
          </div>
        </div>
      </Rnd>
    </div>
  )
}
