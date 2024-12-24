const express = require('express');
const authController = require('../controllers/authController'); // 导入控制器

const router = express.Router();

// 注册路由
router.post('/registerAsClient', authController.registerAsClient);
router.post('/registerAsPsychologist', authController.registerAsPsychologist);
router.post('/Login', authController.login);

module.exports = router;
    