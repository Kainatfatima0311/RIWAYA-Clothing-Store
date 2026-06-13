import { createApp } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Kick off the DB connection on cold start. Mongoose buffers commands until the
// connection is ready, so individual requests don't need to await it here.
connectDB();

const app = createApp();

export default app;
