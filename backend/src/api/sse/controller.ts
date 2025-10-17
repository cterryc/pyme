import { Request, Response } from "express";

interface SSEClient {
  res: Response;
  userId: string;
  connectedAt: Date;
}

let clients: SSEClient[] = [];

// Limpieza y heartbeat
setInterval(() => {
  clients = clients.filter((c) => !c.res.writableEnded);
  clients.forEach((c) => c.res.write(`: keep-alive\n\n`));
}, 25000);

export function subscribeLoanStatus(req: Request, res: Response) {
  const userId = res.locals.user?.id || req.query.userId?.toString() || "anon";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push({ res, userId, connectedAt: new Date() });
  console.log(`👤 [SSE] Cliente conectado: ${userId} (${clients.length})`);

  req.on("close", () => {
    clients = clients.filter((client) => client.res !== res);
    console.log(`❌ [SSE] Cliente desconectado: ${userId}`);
  });
}

export interface LoanStatusEvent {
  id: string;
  newStatus: string;
  updatedAt: Date;
}

export function broadcastLoanStatusUpdate(
  userId: string,
  data: LoanStatusEvent
) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  const targets = clients.filter((c) => c.userId === userId);
  console.log(`📢 [SSE] Enviando a ${userId} (${targets.length})`);
  targets.forEach((client) => client.res.write(msg));
}