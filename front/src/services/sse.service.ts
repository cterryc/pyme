// Servicio para manejar conexiones SSE (Server-Sent Events)

export interface LoanStatusEvent {
  id: string;
  newStatus: string;
  updatedAt: string;
}

export type SSEEventCallback = (event: LoanStatusEvent) => void;

class SSEService {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: number | null = null;
  private callbacks: Set<SSEEventCallback> = new Set();
  private maxReconnectDelay = 30000; // 30 segundos
  private currentReconnectDelay = 1000; // Empezar con 1 segundo

  /**
   * Conectar al stream SSE del backend
   */
  connect(token: string): void {
    if (this.eventSource) {
      console.log('[SSE] Ya existe una conexión activa')
      return
    }

    // EventSource no soporta headers personalizados, así que enviamos el token como query param
    const url = `${import.meta.env.VITE_API_URL}/events?token=${encodeURIComponent(token)}`
    
    console.log('[SSE] 🔗 Conectando a:', url.replace(token, '***'))

    this.eventSource = new EventSource(url, {
      withCredentials: true,
    })

    // Evento: Conexión abierta
    this.eventSource.onopen = () => {
      console.log('[SSE] ✅ Conexión establecida exitosamente')
      this.currentReconnectDelay = 1000 // Resetear delay de reconexión
    }

    // Evento: Mensaje recibido
    this.eventSource.onmessage = (event) => {
      try {
        const data: LoanStatusEvent = JSON.parse(event.data)
        console.log('[SSE] 📨 Evento recibido:', data)
        
        // Notificar a todos los callbacks registrados
        this.callbacks.forEach(callback => callback(data))
      } catch (error) {
        console.error('[SSE] Error al parsear evento:', error)
      }
    }

    // Evento: Error de conexión
    this.eventSource.onerror = (error) => {
      console.error('[SSE] ❌ Error de conexión:', error)
      
      // Cerrar la conexión actual
      this.eventSource?.close()
      this.eventSource = null

      // Intentar reconectar con backoff exponencial
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
      
      // Incrementar delay para próxima reconexión (backoff exponencial)
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
    
    // Retornar función de cleanup
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
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN
  }
}

// Exportar instancia singleton
export const sseService = new SSEService()
