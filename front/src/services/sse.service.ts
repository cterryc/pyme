// Servicio para manejar conexiones SSE (Server-Sent Events)
import { EventSourcePolyfill } from 'event-source-polyfill';

export interface LoanStatusEvent {
  id: string;
  newStatus: string;
  updatedAt: string;
}

export type SSEEventCallback = (event: LoanStatusEvent) => void;

class SSEService {
  private eventSource: EventSourcePolyfill | null = null;
  private reconnectTimeout: number | null = null;
  private callbacks: Set<SSEEventCallback> = new Set();
  private maxReconnectDelay = 30000; // 30 segundos
  private currentReconnectDelay = 1000; // Empezar con 1 segundo

  /**
   * Conectar al stream SSE del backend
   */
  connect(token: string): void {
    if (this.eventSource && this.eventSource.readyState === 1) {
      console.log('[SSE] ⚠️ Ya existe una conexión ACTIVA, ignorando nueva conexión')
      return
    }

    if (this.eventSource) {
      console.log('[SSE] 🧹 Limpiando conexión anterior en estado:', this.eventSource.readyState)
      try {
        this.eventSource.close()
      } catch (e) {
        console.warn('[SSE] Error al cerrar conexión anterior:', e)
      }
      this.eventSource = null
    }

    const url = `${import.meta.env.VITE_API_URL}/events`
    
    console.log('[SSE] 🔗 Conectando a:', url, '| Callbacks activos:', this.callbacks.size)

    this.eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
      heartbeatTimeout: 60000, // 60 segundos
    })

    this.eventSource.onopen = () => {
      console.log('[SSE] ✅ Conexión establecida exitosamente')
      this.currentReconnectDelay = 1000 // Resetear delay de reconexión
    }

    this.eventSource.addEventListener('connected', (event) => {
      const messageEvent = event as MessageEvent
      console.log('[SSE] 🔗 Evento de conexión:', messageEvent.data)
    })

    this.eventSource.addEventListener('heartbeat', (event) => {
      const messageEvent = event as MessageEvent
      const data = JSON.parse(messageEvent.data)
      console.log('[SSE] 💓 Heartbeat recibido:', data.timestamp)
    })

    this.eventSource.addEventListener('loanUpdate', (event) => {
      const messageEvent = event as MessageEvent
      try {
        const data: LoanStatusEvent = JSON.parse(messageEvent.data)
        console.log('[SSE] 📨 Actualización de préstamo recibida:', data)
        
        this.callbacks.forEach(callback => callback(data))
      } catch (error) {
        console.error('[SSE] Error al parsear evento loanUpdate:', error)
      }
    })

    this.eventSource.onmessage = (event) => {
      console.log('[SSE] 📬 Mensaje genérico recibido:', event.data)
    }

  
    this.eventSource.onerror = (error) => {
      console.error('[SSE] ❌ Error de conexión:', error)
   
      this.eventSource?.close()
      this.eventSource = null

      this.scheduleReconnect(token)
    }
  }

  /**
   * Programar reconexión con backoff exponencial
   */
  private scheduleReconnect(token: string): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    console.log(`[SSE] 🔄 Reconectando en ${this.currentReconnectDelay / 1000}s...`)

    this.reconnectTimeout = setTimeout(() => {
      this.connect(token)
      this.currentReconnectDelay = Math.min(
        this.currentReconnectDelay * 2,
        this.maxReconnectDelay
      )
    }, this.currentReconnectDelay)
  }

  /**
   * Registrar un callback para eventos SSE
   */
  subscribe(callback: SSEEventCallback): () => void {
    this.callbacks.add(callback)
    
    return () => {
      this.callbacks.delete(callback)
    }
  }

  /**
   * Desconectar del stream SSE
   */
  disconnect(): void {
    console.log('[SSE] 🔌 Desconectando...')
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.callbacks.clear()
    this.currentReconnectDelay = 1000
  }

  /**
   * Verificar si hay una conexión activa
   */
  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === 1 
  }
}

// Exportar instancia singleton
export const sseService = new SSEService()
