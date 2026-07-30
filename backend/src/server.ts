import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`
  🚀 =================================================== 🚀
     BETMINES BACKEND SERVICE IS LIVE & LISTENING
     - Server Port: ${config.port}
     - Environment: ${config.nodeEnv}
     - API Base URL: http://localhost:${config.port}/api/v1
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
