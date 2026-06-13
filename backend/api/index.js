// Vercel serverless entry point for the RIWAYA API.
//
// On Vercel the Express app does NOT call app.listen() — every incoming request
// is handed to this exported handler instead. We build the app once per cold
// start and ensure the (cached) MongoDB connection is ready before delegating
// to Express, so the first request can't race the connection or leak an
// unhandled rejection. Warm invocations return the cached connection instantly.
// Local development still uses src/server.js via `npm run dev`.
import { createApp } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

const app = createApp();

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed in serverless handler:', err?.message);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Database connection failed' }));
    return;
  }
  return app(req, res);
}
