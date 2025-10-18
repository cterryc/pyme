import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EventSourcePolyfill } from "event-source-polyfill";

interface LoanStatusEvent {
  id: string;
  newStatus: string;
  updatedAt: string;
}

export function useLoanStatusEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("tokenPyme");
    if (!token) {
      console.warn("[SSE] No hay token, no se puede conectar");
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/events`;
    console.log("[SSE] 🔗 Intentando conectar a:", url);
    console.log("[SSE] 🔑 Token presente:", token ? "Sí" : "No");

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 30000,
    });

    eventSource.onopen = () => {
      console.log("[SSE] ✅ Conexión establecida exitosamente");
    };

    eventSource.onmessage = (event) => {
      try {
        const data: LoanStatusEvent = JSON.parse(event.data);
        console.log("📡 [SSE] Evento recibido:", data);

        queryClient.invalidateQueries({ queryKey: ["loansByUser"] });
        queryClient.invalidateQueries({ queryKey: ["pymesByUser"] });

        toast.info(`El crédito ${data.id} cambió de estado a "${data.newStatus}"`, {
          duration: 9000,
        });
      } catch (err) {
        console.error("[SSE] Error al parsear evento:", err);
      }
    };

    eventSource.onerror = (err: any) => {
      console.error("[SSE] ❌ Error en la conexión:", err);
      console.error("[SSE] Estado del EventSource:", eventSource.readyState);
      console.error("[SSE] URL:", eventSource.url);
      
      // readyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
      if (eventSource.readyState === 2) {
        console.error("[SSE] La conexión se cerró permanentemente");
      }
    };

    return () => {
      console.log("[SSE] 🔌 Cerrando conexión (cleanup)");
      eventSource.close();
    };
  }, [queryClient]);
}
