import { Request, Response } from "express";

interface SSEClient {
  res: Response;
  userId: string;
  connectedAt: Date;
}

let clients: SSEClient[] = [];

// Limpieza y heartbeat cada 25s
setInterval(() => {
  clients = clients.filter((c) => !c.res.writableEnded);
  clients.forEach((c) => c.res.write(`: keep-alive\n\n`));
}, 25000);

// ✅ Handler para GET /api/events
export function subscribeLoanStatus(req: Request, res: Response) {
  const userId = res.locals.user?.id || req.query.userId?.toString() || "anon";

  console.log(`[SSE] 🔗 Nueva conexión solicitada por usuario: ${userId}`);

  // --- 🔥 Configuración correcta del stream SSE ---
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("X-Accel-Buffering", "no"); // para proxies (como nginx)
  res.flushHeaders();

  // 🔥 Importante: enviar un primer byte
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
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
