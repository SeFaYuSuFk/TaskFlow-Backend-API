// src/config/environment.js
// Proje Ortam Değişkenleri ve Konfigürasyonu
// Geliştirici: Sefa Yusuf Kütük

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_KEY: process.env.API_KEY || 'taskflow-secret-key-2026',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 dakika
  RATE_LIMIT_MAX_REQUESTS: 100 // IP başına maksimum 100 istek
};
