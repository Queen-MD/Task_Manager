const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllUsers,
  getAllTasks
} = require('../controllers/taskController');

const router = express.Router();

// User routes
router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

// Admin routes
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.get('/admin/all-tasks', auth, adminAuth, getAllTasks);

module.exports = router;