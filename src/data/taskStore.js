// src/data/taskStore.js
// Kalıcı JSON Dosya Tabanlı Veri Deposu (Persistence Layer)
// Geliştirici: Sefa Yusuf Kütük

const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'tasks.json');

// Yardımcı fonksiyon: JSON dosyasını güvenli oku
function readTasksFromFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]', 'utf8');
      return [];
    }
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Veri tabanı okuma hatası:', error.message);
    return [];
  }
}

// Yardımcı fonksiyon: JSON dosyasına güvenli yaz
function writeTasksToFile(tasks) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Veri tabanı yazma hatası:', error.message);
    return false;
  }
}

const taskStore = {
  // Tüm görevleri getir
  getAll: () => {
    return readTasksFromFile();
  },

  // ID'ye göre tek görev getir
  getById: (id) => {
    const tasks = readTasksFromFile();
    return tasks.find(t => t.id.toLowerCase() === id.toLowerCase()) || null;
  },

  // Yeni görev ekle
  create: (taskData) => {
    const tasks = readTasksFromFile();
    const newId = `tsk-${String(tasks.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTask = {
      id: newId,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee ? taskData.assignee.trim() : 'Atanmadı',
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    writeTasksToFile(tasks);
    return newTask;
  },

  // Görev güncelle
  update: (id, updateData) => {
    const tasks = readTasksFromFile();
    const index = tasks.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const existingTask = tasks[index];
    const updatedTask = {
      ...existingTask,
      title: updateData.title !== undefined ? updateData.title.trim() : existingTask.title,
      description: updateData.description !== undefined ? updateData.description.trim() : existingTask.description,
      status: updateData.status !== undefined ? updateData.status : existingTask.status,
      priority: updateData.priority !== undefined ? updateData.priority : existingTask.priority,
      assignee: updateData.assignee !== undefined ? updateData.assignee.trim() : existingTask.assignee,
      tags: updateData.tags !== undefined ? (Array.isArray(updateData.tags) ? updateData.tags : [updateData.tags]) : existingTask.tags,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    writeTasksToFile(tasks);
    return updatedTask;
  },

  // Görev sil
  delete: (id) => {
    const tasks = readTasksFromFile();
    const index = tasks.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const deletedTask = tasks.splice(index, 1)[0];
    writeTasksToFile(tasks);
    return deletedTask;
  }
};

module.exports = taskStore;
