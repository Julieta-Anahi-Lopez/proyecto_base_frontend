
"use client"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-2">
        <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-xl leading-none"
          >
            ✖
          </button>
        </div>
        {/* Contenido dinámico */}
        <div className="space-y-4">{children}</div>

        {/* Footer opcional */}
        <div>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 text-sm py-2 rounded-md hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

