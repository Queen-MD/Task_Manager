const pool = require('../config/database');

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [req.user.id];

    if (status && status !== 'all') {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = await pool.query(query, params);
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, due_date || null]
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, description, status, due_date || null, id, req.user.id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (deletedTask.rows.length === 0) {
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
    const users = await pool.query(
      'SELECT u.id, u.name, u.email, u.created_at, COUNT(t.id) as task_count FROM users u LEFT JOIN tasks t ON u.id = t.user_id WHERE u.is_admin = FALSE GROUP BY u.id ORDER BY u.created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT t.*, u.name as user_name, u.email as user_email FROM tasks t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
    );
    res.json(tasks.rows);
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