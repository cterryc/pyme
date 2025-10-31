import { useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { sseService, type LoanStatusEvent } from '@/services/sse.service'


export const useSSENotifications = () => {
  const queryClient = useQueryClient()
  
  const callbackRef = useRef<((event: LoanStatusEvent) => void) | null>(null)


  callbackRef.current = (event: LoanStatusEvent) => {
    console.log('[SSE Hook] 📨 Nuevo evento recibido:', event)

    queryClient.invalidateQueries({ queryKey: ['loansByUser'] })
    queryClient.invalidateQueries({ queryKey: ['loanRequest'] })
    queryClient.invalidateQueries({ queryKey: ['creditApplications'] })
    queryClient.invalidateQueries({ queryKey: ['loans'] })
    queryClient.invalidateQueries({ queryKey: ['userLoans'] })
    queryClient.invalidateQueries({ queryKey: ['pymesByUser'] })
    
    console.log('[SSE Hook] ✅ Queries invalidadas - UI se actualizará automáticamente')

    const statusConfig: Record<string, { type: 'success' | 'error' | 'info' | 'warning'; title: string; color?: string }> = {
      'Aprobado': {
        type: 'success',
        title: '🎉 ¡Crédito Aprobado!',
      },
      'Rechazado': {
        type: 'error',
        title: '❌ Crédito Rechazado',
      },
      'En revisión': {
        type: 'info',
        title: '🔍 Crédito en Revisión',
      },
      'Documentos requeridos': {
        type: 'warning',
        title: '📄 Documentos Requeridos',
      },
      'Desembolsado': {
        type: 'success',
        title: '💰 Crédito Desembolsado',
      },
      'Cancelado': {
        type: 'warning',
        title: '⚠️ Crédito Cancelado',
      },
      'Enviado': {
        type: 'info',
        title: '📤 Solicitud Enviada',
      },
    }

    const config = statusConfig[event.newStatus] || {
      type: 'info' as const,
      title: '🔔 Actualización de Crédito',
    }

    const toastFn = toast[config.type]

    toastFn(config.title, {
      description: `Tu solicitud de crédito ha cambiado a: ${event.newStatus}`,
      duration: 6000,
    })
  }


  const handleStatusUpdate = useCallback((event: LoanStatusEvent) => {
    callbackRef.current?.(event)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('tokenPyme')
    
    if (!token) {
      console.log('[SSE Hook] ⚠️ No hay token, no se conectará a SSE')
      return
    }

    console.log('[SSE Hook] 🔌 Montando hook SSE...')
    
    sseService.connect(token)

    const unsubscribe = sseService.subscribe(handleStatusUpdate)
    console.log('[SSE Hook] ✅ Suscripción registrada')

    return () => {
      console.log('[SSE Hook] 🧹 Limpiando suscripción del componente...')
      unsubscribe()
    }
  }, [handleStatusUpdate]) 

  return {
    isConnected: sseService.isConnected(),
  }
}

/**
 * Hook para desconectar SSE manualmente (útil al hacer logout)
 */
export const useDisconnectSSE = () => {
  return useCallback(() => {
    sseService.disconnect()
  }, [])
}
