const router = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: ระบบสมาชิกและการยืนยันตัวตน
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: สมัครสมาชิก
 *     description: สมัครสมาชิกใหม่
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: สมชาย ใจดี
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *     responses:
 *       201:
 *         description: สมัครสมาชิกสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    body('name')
      .notEmpty()
      .withMessage('กรุณากรอกชื่อ'),
  ],
  validate,
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: เข้าสู่ระบบ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@northamulet.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login สำเร็จ
 *       401:
 *         description: Email หรือ Password ไม่ถูกต้อง
 */
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validate,
  authController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: ขอ Access Token ใหม่
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: ออกจากระบบ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout สำเร็จ
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: ข้อมูลผู้ใช้ปัจจุบัน
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  authenticate,
  authController.me
);

module.exports = router;