const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.query('SELECT 1')
  .then(() => {
    console.log('✅ MySQL Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = {
  // Wrapper to simulate pg's query method for easier migration
  query: async (text, params) => {
    // Controller SQL migration script will have already converted text from $1 to ?
    const [rows, fields] = await pool.execute(text, params);
    
    // Simulate pg's result object
    return {
      rows: Array.isArray(rows) ? rows : [],
      rowCount: Array.isArray(rows) ? rows.length : rows.affectedRows,
      insertId: rows.insertId
    };
  },
  pool
};
