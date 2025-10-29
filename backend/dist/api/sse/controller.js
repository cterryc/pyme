"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeLoanStatus = subscribeLoanStatus;
exports.handleSSEPreflight = handleSSEPreflight;
exports.broadcastLoanStatusUpdate = broadcastLoanStatusUpdate;
let clients = [];
// Limpieza y heartbeat cada 25s
setInterval(() => {
    clients = clients.filter((c) => !c.res.writableEnded);
    clients.forEach((c) => c.res.write(`: keep-alive\n\n`));
}, 25000);
// ✅ Handler para GET /api/events
function subscribeLoanStatus(req, res) {
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
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    res.write(`: connected ${new Date().toISOString()}\n\n`);
    clients.push({ res, userId, connectedAt: new Date() });
    console.log(`👤 [SSE] ✅ Cliente conectado exitosamente: ${userId} (Total: ${clients.length})`);
    req.on("close", () => {
        clients = clients.filter((client) => client.res !== res);
        console.log(`❌ [SSE] Cliente desconectado: ${userId} (Total: ${clients.length})`);
    });
}
// ✅ Handler para preflight CORS (OPTIONS)
function handleSSEPreflight(req, res) {
    console.log("[SSE] 📋 Recibida solicitud OPTIONS preflight");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
}
// ✅ Enviar evento a un usuario
function broadcastLoanStatusUpdate(userId, data) {
    const msg = `data: ${JSON.stringify(data)}\n\n`;
    const targets = clients.filter((c) => c.userId === userId);
    console.log(`📢 [SSE] Enviando a ${userId} (${targets.length})`);
    targets.forEach((client) => client.res.write(msg));
}
