import { Request, Response } from "express";

interface SSEClient {
  res: Response;
  userId: string;
  connectedAt: Date;
}

let clients: SSEClient[] = [];

// Limpieza y heartbeat cada 15s (más frecuente para evitar timeout de 60s)
setInterval(() => {
  // Filtrar conexiones muertas
  const beforeCount = clients.length;
  clients = clients.filter((c) => !c.res.writableEnded);
  const deadConnections = beforeCount - clients.length;
  
  if (deadConnections > 0) {
    console.log(`[SSE] 🧹 Limpiadas ${deadConnections} conexión(es) muerta(s)`);
  }

  // Enviar keep-alive
  clients.forEach((c) => {
    try {
      c.res.write(`: keep-alive ${new Date().toISOString()}\n\n`);
    } catch (err) {
      console.error(`[SSE] ❌ Error enviando keep-alive a ${c.userId}:`, err);
    }
  });

  // Contar usuarios únicos
  const uniqueUsers = new Set(clients.map(c => c.userId)).size;
  console.log(`[SSE] 💓 Keep-alive enviado a ${clients.length} conexión(es) de ${uniqueUsers} usuario(s) único(s)`);
}, 15000);

// ✅ Handler para GET /api/events
export function subscribeLoanStatus(req: Request, res: Response) {
  const userId = res.locals.user?.id || req.query.userId?.toString() || "anon";

  console.log(`[SSE] 🔗 Nueva conexión solicitada por usuario: ${userId}`);

  // --- 🔥 Configuración correcta del stream SSE ---
  // Limpiar URLs removiendo barras finales
  const cleanUrl = (url: string | undefined) => {
    if (!url) return null;
    return url.replace(/\/$/, ''); // Remover barra final
  };

  // Usar el origin dinámico según entorno
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [cleanUrl(process.env.FRONTEND_URL)].filter(Boolean)
      : ["http://localhost:5173", "http://localhost:5174"];

  const origin = req.headers.origin || "";
  const cleanOrigin = cleanUrl(origin);
  
  console.log(`[SSE] 🌐 Origin: ${origin} (cleaned: ${cleanOrigin})`);
  console.log(`[SSE] 🌐 Allowed origins:`, allowedOrigins);
  
  if (allowedOrigins.includes(cleanOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    console.log(`[SSE] ✅ Origin permitido: ${origin}`);
  } else {
    console.log(`[SSE] ❌ Origin NO permitido: ${origin}`);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Cache-Control");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("X-Accel-Buffering", "no"); 
  res.flushHeaders();

  // 🔒 Cerrar conexiones antiguas del mismo usuario (evitar duplicados)
  const existingConnections = clients.filter(c => c.userId === userId);
  if (existingConnections.length > 0) {
    console.log(`[SSE] ⚠️ Usuario ${userId} ya tiene ${existingConnections.length} conexión(es) activa(s), cerrando...`);
    existingConnections.forEach(oldClient => {
      try {
        oldClient.res.end();
      } catch (err) {
        console.error(`[SSE] Error cerrando conexión antigua:`, err);
      }
    });
    // Limpiar del array
    clients = clients.filter(c => c.userId !== userId);
  }

  res.write(`: connected ${new Date().toISOString()}\n\n`);

  clients.push({ res, userId, connectedAt: new Date() });
  console.log(`👤 [SSE] ✅ Cliente conectado exitosamente: ${userId} (Total: ${clients.length})`);

  req.on("close", () => {
    clients = clients.filter((client) => client.res !== res);
    console.log(`❌ [SSE] Cliente desconectado: ${userId} (Total: ${clients.length})`);
  });
}

// ✅ Handler para preflight CORS (OPTIONS)
export function handleSSEPreflight(req: Request, res: Response) {
  console.log("[SSE] 📋 Recibida solicitud OPTIONS preflight");
  
  // Limpiar URLs removiendo barras finales
  const cleanUrl = (url: string | undefined) => {
    if (!url) return null;
    return url.replace(/\/$/, ''); // Remover barra final
  };

  // Usar el origin dinámico según entorno
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [cleanUrl(process.env.FRONTEND_URL)].filter(Boolean)
      : ["http://localhost:5173", "http://localhost:5174"];

  const origin = req.headers.origin || "";
  const cleanOrigin = cleanUrl(origin);
  
  if (allowedOrigins.includes(cleanOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Cache-Control");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // Cache preflight por 24 horas
  res.status(204).end();
}

// ✅ Estructura de evento
export interface LoanStatusEvent {
  id: string;
  newStatus: string;
  updatedAt: Date;
}

// ✅ Enviar evento a un usuario
export function broadcastLoanStatusUpdate(userId: string, data: LoanStatusEvent) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  const targets = clients.filter((c) => c.userId === userId);
  console.log(`📢 [SSE] Enviando a ${userId} (${targets.length})`);
  targets.forEach((client) => client.res.write(msg));
}