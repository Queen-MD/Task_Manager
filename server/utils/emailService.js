const nodemailer = require('nodemailer');
const cron = require('node-cron');
const pool = require('../config/database');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendDueDateReminder = async (userEmail, taskTitle, dueDate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Task Due Date Reminder',
      html: `
        <h2>Task Due Date Reminder</h2>
        <p>Your task "<strong>${taskTitle}</strong>" is due on ${new Date(dueDate).toLocaleDateString()}.</p>
        <p>Please complete it on time!</p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Check for due tasks every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTasks = await pool.query(`
      SELECT t.title, t.due_date, u.email 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.due_date = $1 AND t.status = 'pending'
    `, [tomorrow.toISOString().split('T')[0]]);

    for (const task of dueTasks.rows) {
      await sendDueDateReminder(task.email, task.title, task.due_date);
    }
  } catch (error) {
    console.error('Error checking due tasks:', error);
  }
});

module.exports = { sendDueDateReminder };