// db.js
const mysql = require('mysql2/promise');

// 创建 MySQL 连接池，使用 Promise API
const pool = mysql.createPool({
  host: 'localhost',  // 默认 localhost
  user: 'root',      // 默认 root
  password: '',  // 默认无密码
  database: 'mind_hug', // 默认 myapp
  waitForConnections: true,
  connectionLimit: 10,  // 设置连接池的最大连接数
  queueLimit: 0
});

// 导出连接池对象
module.exports = pool;
