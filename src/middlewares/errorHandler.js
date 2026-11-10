// src/middlewares/errorHandler.js
// Merkezi Hata Yönetimi (Centralized Error Handling)
// Geliştirici: Sefa Yusuf Kütük

// 404 Bulunamayan Rota Yakalayıcı
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'Not Found',
    message: `İstenen '${req.originalUrl}' uç noktası bu API sunucusunda bulunamadı.`,
    availableEndpoints: {
      tasks: '/api/tasks',
      search: '/api/tasks/search?keyword=...',
      reports: '/api/reports/summary',
      dashboard: '/'
    }
  });
}

// Global Hata Yakalayıcı (500 Internal Server Error)
function globalErrorHandler(err, req, res, next) {
  console.error('Beklenmeyen Sunucu Hatası:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Sunucu tarafında beklenmeyen bir hata oluştu.',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
