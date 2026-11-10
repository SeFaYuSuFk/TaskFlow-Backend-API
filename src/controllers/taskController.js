// src/controllers/taskController.js
// Görev Yönetimi İş Mantığı (Business Logic)
// Zorunlu CRUD + İsteğe Bağlı Pratik 1 (Filtreleme, Arama, Sayfalama, Sıralama)
// Geliştirici: Sefa Yusuf Kütük

const taskStore = require('../data/taskStore');

// 1. Tüm Görevleri Listele (Filtreleme, Sıralama ve Sayfalama Destekli)
// GET /api/tasks?status=completed&priority=high&assignee=sefa&sort=createdAt&page=1&limit=10
exports.getTasks = (req, res) => {
  try {
    let tasks = taskStore.getAll();
    const { status, priority, assignee, sort, order, page, limit } = req.query;

    // Filtreleme: Duruma göre (?status=completed)
    if (status) {
      tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // Filtreleme: Önceliğe göre (?priority=high)
    if (priority) {
      tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // Filtreleme: Atanan kişiye göre (?assignee=sefa)
    if (assignee) {
      tasks = tasks.filter(t => t.assignee.toLowerCase().includes(assignee.toLowerCase()));
    }

    // Sıralama (?sort=createdAt&order=desc)
    if (sort) {
      const isDesc = (order || 'asc').toLowerCase() === 'desc';
      tasks.sort((a, b) => {
        const valA = a[sort] || '';
        const valB = b[sort] || '';
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // Toplam filtrelenmiş sayı
    const totalCount = tasks.length;

    // Sayfalama (?page=1&limit=10)
    let paginatedTasks = tasks;
    let paginationInfo = null;

    if (page || limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      paginatedTasks = tasks.slice(startIndex, startIndex + limitNum);
      paginationInfo = {
        currentPage: pageNum,
        pageSize: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      };
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Görevler başarıyla listelendi.',
      count: paginatedTasks.length,
      totalCount: totalCount,
      pagination: paginationInfo,
      data: paginatedTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Görevler getirilirken sunucu hatası oluştu.',
      error: error.message
    });
  }
};

// 2. Belirli Bir Görevin Detayını Getir
// GET /api/tasks/:id
exports.getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const task = taskStore.getById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `'${id}' kimlik numaralı görev sistemde bulunamadı.`
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Görev detayı başarıyla getirildi.',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Görev detayı getirilirken sunucu hatası oluştu.',
      error: error.message
    });
  }
};

// 3. Görev Arama Motoru (Başlık, Açıklama ve Etiketlerde Arama)
// GET /api/tasks/search?keyword=backend
exports.searchTasks = (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: "Arama yapabilmek için 'keyword' parametresi gereklidir. Örnek: /api/tasks/search?keyword=backend"
      });
    }

    const term = keyword.toLowerCase().trim();
    const allTasks = taskStore.getAll();

    const matchedTasks = allTasks.filter(task => {
      const inTitle = task.title.toLowerCase().includes(term);
      const inDesc = task.description.toLowerCase().includes(term);
      const inAssignee = task.assignee.toLowerCase().includes(term);
      const inTags = Array.isArray(task.tags) && task.tags.some(tag => tag.toLowerCase().includes(term));
      return inTitle || inDesc || inAssignee || inTags;
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `'${keyword}' kelimesine uygun ${matchedTasks.length} adet görev bulundu.`,
      keyword: keyword,
      matchCount: matchedTasks.length,
      data: matchedTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Arama yapılırken bir hata oluştu.',
      error: error.message
    });
  }
};

// 4. Belirli Bir Çalışana Atanan Görevleri Getir
// GET /api/tasks/assignee/:assigneeName
exports.getTasksByAssignee = (req, res) => {
  try {
    const { assigneeName } = req.params;
    const allTasks = taskStore.getAll();
    const userTasks = allTasks.filter(t => t.assignee.toLowerCase().includes(assigneeName.toLowerCase()));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `'${assigneeName}' kullanıcısına ait görevler listelendi.`,
      assignee: assigneeName,
      taskCount: userTasks.length,
      data: userTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Kullanıcı görevleri getirilirken hata oluştu.',
      error: error.message
    });
  }
};

// 5. Yeni Görev Ekle
// POST /api/tasks
exports.createTask = (req, res) => {
  try {
    const newTask = taskStore.create(req.body);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Yeni görev başarıyla oluşturuldu.',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Görev oluşturulurken sunucu hatası oluştu.',
      error: error.message
    });
  }
};

// 6. Görev Güncelle
// PUT /api/tasks/:id
exports.updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const updated = taskStore.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `'${id}' kimlik numaralı görev güncellenemedi çünkü sistemde bulunamadı.`
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Görev başarıyla güncellendi.',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Görev güncellenirken sunucu hatası oluştu.',
      error: error.message
    });
  }
};

// 7. Görev Sil (API Key ile Güvenlik Altına Alınmıştır)
// DELETE /api/tasks/:id
exports.deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = taskStore.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `'${id}' kimlik numaralı görev silinemedi çünkü sistemde bulunamadı.`
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `'${id}' kimlikli görev ve tüm ilişkili kayıtlar başarıyla silindi.`,
      deletedItem: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Görev silinirken sunucu hatası oluştu.',
      error: error.message
    });
  }
};
