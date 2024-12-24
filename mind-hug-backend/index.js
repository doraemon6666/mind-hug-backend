const express = require('express');
const bodyParser = require('body-parser');
// require('dotenv').config(); // 载入环境变量
const cors = require('cors');
const authRoutes = require('./routes/auth'); // 导入路由

const app = express();
const port = process.env.PORT || 5000;

// 中间件：解析请求体
app.use(bodyParser.json());
// 使用 CORS 中间件，允许所有源跨域请求
app.use(cors());

// 注册用户路由
app.use('/api/auth', authRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
