// src/routes/taskRoutes.js
// Görev Yönetimi API Rotaları
// Geliştirici: Sefa Yusuf Kütük

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask, validateTaskUpdate } = require('../middlewares/validator');
const { apiKeyAuth } = require('../middlewares/security');

// 1. Görev Arama (Daha spesifik olduğu için :id rotasından önce gelmelidir)
// GET /api/tasks/search?keyword=...
router.get('/search', taskController.searchTasks);

// 2. Kullanıcıya Göre Görev Listeleme
// GET /api/tasks/assignee/:assigneeName
router.get('/assignee/:assigneeName', taskController.getTasksByAssignee);

// 3. Tüm Görevleri Listele (Filtreleme, Sıralama, Sayfalama)
// GET /api/tasks
router.get('/', taskController.getTasks);

// 4. Tek Bir Görev Detayı
// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// 5. Yeni Görev Oluştur (Validation Middleware Korumalı)
// POST /api/tasks
router.post('/', validateTask, taskController.createTask);

// 6. Görev Güncelle (Partial Validation Korumalı)
// PUT /api/tasks/:id
router.put('/:id', validateTaskUpdate, taskController.updateTask);

// 7. Görev Sil (API Key Güvenlik Korumalı)
// DELETE /api/tasks/:id
router.delete('/:id', apiKeyAuth, taskController.deleteTask);

module.exports = router;
