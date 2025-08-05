const { dbGet, dbAll, dbRun } = require('../config/database');

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = await dbAll(query, params);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    const result = await dbRun(
      'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description, due_date || null]
    );

    const newTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [result.id]);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    const result = await dbRun(
      'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title, description, status, due_date || null, id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin functions
const getAllUsers = async (req, res) => {
  try {
    const users = await dbAll(`
      SELECT u.id, u.name, u.email, u.created_at, 
             COUNT(t.id) as task_count 
      FROM users u 
      LEFT JOIN tasks t ON u.id = t.user_id 
      WHERE u.is_admin = 0 
      GROUP BY u.id 
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await dbAll(`
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllUsers,
  getAllTasks
};