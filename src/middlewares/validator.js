// src/middlewares/validator.js
// Musa Hoca'nın İsteğe Bağlı Pratik 2'si: Validation Middleware
// title, description, priority ve assignee alanlarını denetler.
// Hatalı veya eksik veri girişinde 400 Bad Request ve açıklayıcı Türkçe hata listesi döner.
// Geliştirici: Sefa Yusuf Kütük

const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
const validPriorities = ['low', 'medium', 'high', 'critical'];

function validateTask(req, res, next) {
  const { title, description, priority, assignee, status } = req.body;
  const errors = [];

  // 1. Title Kontrolü (Zorunlu, minimum 3 karakter)
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Görev başlığı (title) zorunludur ve boş bırakılamaz.'
    });
  } else if (title.trim().length < 3) {
    errors.push({
      field: 'title',
      message: 'Görev başlığı en az 3 karakter uzunluğunda olmalıdır.'
    });
  } else if (title.trim().length > 150) {
    errors.push({
      field: 'title',
      message: 'Görev başlığı 150 karakterden uzun olamaz.'
    });
  }

  // 2. Assignee Kontrolü (Zorunlu, en az 2 karakter)
  if (!assignee || typeof assignee !== 'string' || assignee.trim().length === 0) {
    errors.push({
      field: 'assignee',
      message: 'Görevin atanacağı kişi (assignee) zorunludur.'
    });
  } else if (assignee.trim().length < 2) {
    errors.push({
      field: 'assignee',
      message: 'Atanan kişi adı en az 2 karakter olmalıdır.'
    });
  }

  // 3. Priority Kontrolü (Geçerli bir öncelik seviyesi mi?)
  if (priority !== undefined) {
    const normalizedPriority = String(priority).toLowerCase().trim();
    if (!validPriorities.includes(normalizedPriority)) {
      errors.push({
        field: 'priority',
        message: `Geçersiz öncelik seviyesi: '${priority}'. İzin verilen değerler: ${validPriorities.join(', ')}`
      });
    } else {
      req.body.priority = normalizedPriority;
    }
  }

  // 4. Status Kontrolü (Geçerli bir durum mu?)
  if (status !== undefined) {
    const normalizedStatus = String(status).toLowerCase().trim();
    if (!validStatuses.includes(normalizedStatus)) {
      errors.push({
        field: 'status',
        message: `Geçersiz görev durumu: '${status}'. İzin verilen değerler: ${validStatuses.join(', ')}`
      });
    } else {
      req.body.status = normalizedStatus;
    }
  }

  // Hata varsa 400 Bad Request dön
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error (Doğrulama Hatası)',
      message: 'Gönderilen görev verileri doğrulama kurallarından geçemedi.',
      errorCount: errors.length,
      errors: errors
    });
  }

  next();
}

// Güncelleme işlemi için kısmi doğrulama (Partial Update Validator)
function validateTaskUpdate(req, res, next) {
  const { title, priority, assignee, status } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      errors.push({
        field: 'title',
        message: 'Görev başlığı en az 3 karakter uzunluğunda olmalıdır.'
      });
    }
  }

  if (assignee !== undefined) {
    if (typeof assignee !== 'string' || assignee.trim().length < 2) {
      errors.push({
        field: 'assignee',
        message: 'Atanan kişi adı en az 2 karakter olmalıdır.'
      });
    }
  }

  if (priority !== undefined) {
    const normalizedPriority = String(priority).toLowerCase().trim();
    if (!validPriorities.includes(normalizedPriority)) {
      errors.push({
        field: 'priority',
        message: `Geçersiz öncelik: '${priority}'. İzin verilen değerler: ${validPriorities.join(', ')}`
      });
    } else {
      req.body.priority = normalizedPriority;
    }
  }

  if (status !== undefined) {
    const normalizedStatus = String(status).toLowerCase().trim();
    if (!validStatuses.includes(normalizedStatus)) {
      errors.push({
        field: 'status',
        message: `Geçersiz durum: '${status}'. İzin verilen değerler: ${validStatuses.join(', ')}`
      });
    } else {
      req.body.status = normalizedStatus;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error (Doğrulama Hatası)',
      message: 'Güncelleme verileri doğrulama kurallarından geçemedi.',
      errors: errors
    });
  }

  next();
}

module.exports = {
  validateTask,
  validateTaskUpdate
};
