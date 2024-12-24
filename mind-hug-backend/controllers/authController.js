const bcrypt = require('bcrypt');
const db = require('../db'); // 引入数据库连接池
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file
// register as client
exports.registerAsClient = async (req, res) => {
  const { username, email, password,dateOfBrith,gender } = req.body;

  // 基本验证
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // 使用 await 查询用户是否已存在
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(200).json({ message: 'User already exists' });
    }

    // 密码哈希
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    // 返回成功响应
    return res.status(200).json({ message: 'User registered successfully', userId: result.insertId,success:true });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};
// register as Psychologist
exports.registerAsPsychologist = async (req, res) => {
    const { username, email, password,dateOfBrith,gender } = req.body;
  
    // 基本验证
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // 使用 await 查询用户是否已存在
      const [existingUser] = await db.query('SELECT * FROM therapists WHERE email = ?', [email]);
  
      if (existingUser.length > 0) {
        return res.status(200).json({ message: 'User already exists' });
      }
  
      // 密码哈希
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 插入新用户
      const [result] = await db.query('INSERT INTO therapists (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
  
      // 返回成功响应
      return res.status(200).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: 'An error occurred during registration' });
    }
  };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 基本验证
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Step 1: Check in users table
    let [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // Step 2: If not found in users table, check therapists table
    if (rows.length === 0) {
      [rows] = await db.query('SELECT * FROM therapists WHERE email = ?', [email]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Incorrect email or password' });
    }

    const user = rows[0]; // The user data from either table
    console.log(user,'user--------------------------------')
    // Step 3: Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 4: Generate a JWT token if credentials are valid
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Adding `role` to identify if it's a user or therapist
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Step 5: Respond with success and the JWT token
    return res.status(200).json({ message: 'Login successful', token,success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};