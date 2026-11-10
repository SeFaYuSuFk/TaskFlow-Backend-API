// src/middlewares/logger.js
// Musa Hoca'nın İstediği Temel Middleware: Request Logger
// Tüm API isteklerini (HTTP Metodu, URL/Endpoint, Durum Kodu, Yanıt Süresi ve Zaman Damgası)
// hem renkli olarak konsola basar hem de 'logs/access.log' dosyasına kalıcı kaydeder.
// Geliştirici: Sefa Yusuf Kütük

const fs = require('fs');
const path = require('path');

// Logs dizini yoksa otomatik oluştur
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'access.log');

// Renkli Terminal Kodları (ANSI)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function getMethodColor(method) {
  switch (method.toUpperCase()) {
    case 'GET': return colors.green;
    case 'POST': return colors.blue;
    case 'PUT': return colors.yellow;
    case 'DELETE': return colors.red;
    default: return colors.cyan;
  }
}

function requestLogger(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

  // Yanıt tamamlandığında logla
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Konsol Formatı (Renkli)
    const methodColored = `${getMethodColor(method)}${method}${colors.reset}`;
    const statusColored = statusCode >= 400 ? `${colors.red}${statusCode}${colors.reset}` : `${colors.green}${statusCode}${colors.reset}`;
    console.log(`[${colors.gray}${timestamp}${colors.reset}] ${methodColored} ${url} ${statusColored} - ${colors.bright}${duration}ms${colors.reset} (IP: ${ip})`);

    // Dosyaya Yazma Formatı (Standart metin)
    const logLine = `[${timestamp}] ${method} ${url} ${statusCode} - ${duration}ms - IP: ${ip}\n`;
    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) console.error('Log dosyasına yazılamadı:', err.message);
    });
  });

  next();
}

module.exports = requestLogger;
