// src/controllers/reportController.js
// Musa Hoca'nın İsteğe Bağlı Pratik 3'ü: Raporlama Servisleri
// İstatistiksel Veri İşleme ve Sistem Özeti
// Geliştirici: Sefa Yusuf Kütük

const taskStore = require('../data/taskStore');

// 1. Tamamlanan Görev Sayısı ve Listesi
// GET /api/reports/completed
exports.getCompletedReport = (req, res) => {
  try {
    const allTasks = taskStore.getAll();
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const totalCount = allTasks.length;
    const completedCount = completedTasks.length;
    const ratio = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      statusCode: 200,
      reportName: 'Tamamlanan Görevler Raporu',
      generatedAt: new Date().toISOString(),
      summary: {
        totalTasks: totalCount,
        completedTasks: completedCount,
        completionRatePercentage: `${ratio}%`
      },
      data: completedTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Tamamlanan görevler raporu oluşturulurken hata oluştu.',
      error: error.message
    });
  }
};

// 2. Bekleyen ve Devam Eden Görev Sayısı ve Listesi
// GET /api/reports/pending
exports.getPendingReport = (req, res) => {
  try {
    const allTasks = taskStore.getAll();
    const pendingTasks = allTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    const totalCount = allTasks.length;
    const pendingCount = pendingTasks.length;

    res.status(200).json({
      success: true,
      statusCode: 200,
      reportName: 'Bekleyen ve Devam Eden Görevler Raporu',
      generatedAt: new Date().toISOString(),
      summary: {
        totalTasks: totalCount,
        activeTasks: pendingCount,
        pendingBreakdown: {
          pending: allTasks.filter(t => t.status === 'pending').length,
          in_progress: allTasks.filter(t => t.status === 'in_progress').length
        }
      },
      data: pendingTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Bekleyen görevler raporu oluşturulurken hata oluştu.',
      error: error.message
    });
  }
};

// 3. Genel Sistem ve Proje Yönetimi Özeti (Dashboard Analytics)
// GET /api/reports/summary
exports.getSummaryReport = (req, res) => {
  try {
    const allTasks = taskStore.getAll();
    const total = allTasks.length;

    // Durum Dağılımı
    const statusCounts = {
      pending: allTasks.filter(t => t.status === 'pending').length,
      in_progress: allTasks.filter(t => t.status === 'in_progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      cancelled: allTasks.filter(t => t.status === 'cancelled').length
    };

    // Öncelik Dağılımı
    const priorityCounts = {
      critical: allTasks.filter(t => t.priority === 'critical').length,
      high: allTasks.filter(t => t.priority === 'high').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      low: allTasks.filter(t => t.priority === 'low').length
    };

    // Çalışan Başına Görev Dağılımı
    const assigneeCounts = {};
    allTasks.forEach(t => {
      const name = t.assignee || 'Atanmamış';
      assigneeCounts[name] = (assigneeCounts[name] || 0) + 1;
    });

    const completionRate = total > 0 ? ((statusCounts.completed / total) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      statusCode: 200,
      reportName: 'TaskFlow Genel Sistem ve Sprint Özeti',
      developer: 'Sefa Yusuf Kütük',
      generatedAt: new Date().toISOString(),
      metrics: {
        totalTasks: total,
        completionRate: `${completionRate}%`,
        statusBreakdown: statusCounts,
        priorityBreakdown: priorityCounts,
        teamWorkload: assigneeCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Sistem özeti oluşturulurken hata oluştu.',
      error: error.message
    });
  }
};
