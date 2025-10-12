interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const StatusBadge = ({ status, variant = 'default' }: StatusBadgeProps) => {
  const getVariantClasses = (variantType: string) => {
    switch (variantType) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprobado':
      case 'activa':
      case 'pagado':
        return 'success'
      case 'pendiente':
      case 'en revisión':
        return 'warning'
      case 'rechazado':
      case 'suspendida':
      case 'vencido':
        return 'error'
      default:
        return 'default'
    }
  }

  const finalVariant = variant === 'default' ? getStatusVariant(status) : variant

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses(finalVariant)}`}>
      {status}
    </span>
  )
}