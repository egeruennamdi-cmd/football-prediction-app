import app from './app';
import { config } from './config/env';

const host = '0.0.0.0';
const port = config.port;

const server = app.listen(port, host, () => {
  console.log(`
  🚀 =================================================== 🚀
     DEEPPREDICTBET BACKEND SERVICE IS LIVE & LISTENING
     - Server Host: ${host}
     - Server Port: ${port}
     - Environment: ${config.nodeEnv}
     - API Base URL: http://${host}:${port}/api/v1
     - 50-Bookmaker Converter Endpoint: /api/v1/converter/convert
     - AI Bet Doctor Endpoint: /api/v1/doctor/audit
  🚀 =================================================== 🚀
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed cleanly.');
  });
});
