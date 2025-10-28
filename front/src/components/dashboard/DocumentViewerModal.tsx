import { useEffect, useState } from 'react'

interface DocumentViewerModalProps {
  fileUrl: string
  fileName: string
  onClose: () => void
}

export const DocumentViewerModal = ({ fileUrl, fileName, onClose }: DocumentViewerModalProps) => {
  const [isImage, setIsImage] = useState(false)
  const [isPDF, setIsPDF] = useState(false)

  useEffect(() => {
    const extension = fileUrl.split('.').pop()?.toLowerCase() || ''
    setIsImage(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension))
    setIsPDF(extension === 'pdf')
  }, [fileUrl])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
            {fileName}
          </h2>
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Abrir en nueva pestaña
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={fileUrl}
              title={fileName}
              className="w-full h-full min-h-[600px] border-0 rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg
                className="w-20 h-20 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 mb-4">
                Vista previa no disponible para este tipo de archivo
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
