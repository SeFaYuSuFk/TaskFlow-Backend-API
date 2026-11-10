// src/routes/reportRoutes.js
// Raporlama ve Analitik Servis Rotaları
// Geliştirici: Sefa Yusuf Kütük

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// 1. Genel Sistem Özeti (Summary Dashboard)
// GET /api/reports/summary
router.get('/summary', reportController.getSummaryReport);

// 2. Tamamlanan Görevler Raporu
// GET /api/reports/completed
router.get('/completed', reportController.getCompletedReport);

// 3. Bekleyen / Devam Eden Görevler Raporu
// GET /api/reports/pending
router.get('/pending', reportController.getPendingReport);

module.exports = router;
