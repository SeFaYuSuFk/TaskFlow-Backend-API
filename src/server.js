// src/server.js
// TASKFLOW REST API — Ana Sunucu Dosyası
// Node.js & Express.js Bitirme Projesi
// Geliştirici: Sefa Yusuf Kütük

const express = require('express');
const path = require('path');
const env = require('./config/environment');

// Middleware'ler
const requestLogger = require('./middlewares/logger');
const {
  helmetMiddleware,
  apiRateLimiter,
  corsMiddleware,
  sanitizeInput
} = require('./middlewares/security');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

// Rotalar
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// 1. GÜVENLİK KATMANLARI
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use('/api/', apiRateLimiter); // API uç noktalarına DDoS bot koruması

// 2. GÖVDE VE METİN İŞLEME (Body Parsers & Sanitization)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput); // XSS temizliği

// 3. LOGGING KATMANI (Musa Hoca'nın Zorunlu İsteri)
app.use(requestLogger);

// 4. STATİK DOSYALAR (Canlı Test Paneli - Dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// 5. API ROTALARI
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);

// Kök Dizin Bilgilendirme (Eğer tarayıcıdan doğrudan girilirse)
app.get('/api', (req, res) => {
  res.status(200).json({
    project: 'TaskFlow REST API',
    version: '1.0.0',
    developer: 'Sefa Yusuf Kütük',
    status: 'ONLINE',
    documentation: 'http://localhost:' + env.PORT,
    endpoints: {
      tasks: '/api/tasks',
      search: '/api/tasks/search?keyword=...',
      completedReports: '/api/reports/completed',
      pendingReports: '/api/reports/pending',
      summaryReport: '/api/reports/summary'
    }
  });
});

// 6. HATA YÖNETİMİ
app.use(notFoundHandler);
app.use(globalErrorHandler);

// SUNUCUYU BAŞLAT
const server = app.listen(env.PORT, () => {
  console.log('\n============================================================');
  console.log('  ⚡ TASKFLOW REST API SUNUCUSU AKTİF');
  console.log('  👤 Geliştirici: Sefa Yusuf Kütük');
  console.log('  🌐 Port: ' + env.PORT);
  console.log('  🔗 Canlı Test Paneli: http://localhost:' + env.PORT);
  console.log('  🛡️  Güvenlik: Helmet, CORS, Rate Limit, API Key AKTİF');
  console.log('============================================================\n');
});

module.exports = { app, server };
