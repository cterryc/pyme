import { useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { sseService, type LoanStatusEvent } from '@/services/sse.service'

/**
 * Hook para manejar notificaciones SSE de cambios de estado de créditos
 * ✅ Optimizado para evitar conexiones duplicadas
 */
export const useSSENotifications = () => {
  const queryClient = useQueryClient()
  
  // Ref para almacenar el callback actual (siempre usa la versión más reciente)
  const callbackRef = useRef<((event: LoanStatusEvent) => void) | null>(null)

  // Actualizar el ref cada vez que cambia queryClient
  callbackRef.current = (event: LoanStatusEvent) => {
    console.log('[SSE Hook] 📨 Nuevo evento recibido:', event)

    // Invalidar queries relacionadas con créditos para refrescar la UI automáticamente
    queryClient.invalidateQueries({ queryKey: ['loansByUser'] })
    queryClient.invalidateQueries({ queryKey: ['loanRequest'] })
    queryClient.invalidateQueries({ queryKey: ['creditApplications'] })
    queryClient.invalidateQueries({ queryKey: ['loans'] })
    queryClient.invalidateQueries({ queryKey: ['userLoans'] })
    queryClient.invalidateQueries({ queryKey: ['pymesByUser'] })
    
    console.log('[SSE Hook] ✅ Queries invalidadas - UI se actualizará automáticamente')

    // Mapeo de estados a colores y mensajes
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

    // Mostrar toast según el tipo de evento
    const toastFn = toast[config.type]

    toastFn(config.title, {
      description: `Tu solicitud de crédito ha cambiado a: ${event.newStatus}`,
      duration: 6000,
    })
  }

  // Wrapper estable que llama al ref
  const handleStatusUpdate = useCallback((event: LoanStatusEvent) => {
    callbackRef.current?.(event)
  }, []) // ✅ Sin dependencias - nunca cambia

  useEffect(() => {
    // Obtener token de autenticación
    const token = localStorage.getItem('tokenPyme')
    
    if (!token) {
      console.log('[SSE Hook] ⚠️ No hay token, no se conectará a SSE')
      return
    }

    console.log('[SSE Hook] 🔌 Montando hook SSE...')
    
    // Conectar al servicio SSE (el servicio previene duplicados internamente)
    sseService.connect(token)

    // Suscribirse a eventos
    const unsubscribe = sseService.subscribe(handleStatusUpdate)
    console.log('[SSE Hook] ✅ Suscripción registrada')

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      console.log('[SSE Hook] 🧹 Limpiando suscripción del componente...')
      unsubscribe()
    }
  }, [handleStatusUpdate]) // ✅ handleStatusUpdate nunca cambia

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
