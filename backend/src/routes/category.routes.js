const router = require('express').Router();
const { body } = require('express-validator');

const controller = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: จัดการหมวดหมู่สินค้า
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: ดึงรายการหมวดหมู่ทั้งหมด
 *     description: แสดงหมวดหมู่สินค้าทั้งหมด
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: ดูรายละเอียดหมวดหมู่
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 3f7a9b39-c600-4aee-a06b-d8ea1e5d354f
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบหมวดหมู่
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: เพิ่มหมวดหมู่
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: พระสมเด็จ
 *               description:
 *                 type: string
 *                 example: หมวดพระสมเด็จ
 *     responses:
 *       201:
 *         description: เพิ่มสำเร็จ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin Only
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  [
    body('name')
      .notEmpty()
      .withMessage('กรุณากรอกชื่อหมวดหมู่'),
  ],
  validate,
  controller.create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: แก้ไขหมวดหมู่
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 *       404:
 *         description: ไม่พบหมวดหมู่
 */
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  controller.update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: ลบหมวดหมู่
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *       404:
 *         description: ไม่พบหมวดหมู่
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  controller.remove
);

module.exports = router;