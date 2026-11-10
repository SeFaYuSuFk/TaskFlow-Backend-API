// src/middlewares/security.js
// 5 Katmanlı Kurumsal Güvenlik Kalkanı
// 1. Helmet (HTTP Başlık Koruması)
// 2. Rate Limiting (DDoS & Brute-Force Bot Koruması)
// 3. CORS (Güvenli Çapraz Köken Erişimi)
// 4. API Key Koruması (x-api-key ile Yetkisiz Silme/İşlem Engeli)
// 5. Input Sanitization (XSS Kod Enjeksiyon Koruması)
// Geliştirici: Sefa Yusuf Kütük

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const env = require('../config/environment');

// 1. Katman: Helmet Güvenlik Başlıkları
const helmetMiddleware = helmet({
  contentSecurityPolicy: false // Canlı test dashboard'unun CDN/script çalıştırabilmesi için
});

// 2. Katman: Rate Limiter (DDoS ve Bot Koruması)
const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 dakika
  max: env.RATE_LIMIT_MAX_REQUESTS,   // Maksimum 100 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    error: 'Too Many Requests',
    message: 'Güvenlik Kalkanı: Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
  }
});

// 3. Katman: CORS Yapılandırması
const corsMiddleware = cors({
  origin: '*', // Geliştirme ortamında serbest, üretimde frontend domaini ile sınırlandırılabilir
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
});

// 4. Katman: API Key Yetkilendirme Middleware'i (Kritik İşlemler İçin)
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  // Eğer istekte geçerli bir API anahtarı yoksa 401 Unauthorized dön
  if (!apiKey || apiKey !== env.API_KEY) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: 'Unauthorized (Yetkisiz Erişim)',
      message: 'Bu kritik işlemi (Görev Silme / Admin) gerçekleştirmek için geçerli bir x-api-key başlığı gereklidir.',
      hint: `Test için Header alanına 'x-api-key: ${env.API_KEY}' ekleyin.`
    });
  }

  next();
}

// 5. Katman: XSS ve Zararlı Kod Temizleme (Sanitization)
function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // <script> ve tehlikeli HTML etiketlerini zararsız hale getir
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]+>/g, '');
      }
    }
  }
  next();
}

module.exports = {
  helmetMiddleware,
  apiRateLimiter,
  corsMiddleware,
  apiKeyAuth,
  sanitizeInput
};
