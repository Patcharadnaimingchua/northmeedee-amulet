const router = require('express').Router();

const controller = require('../controllers/address.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: จัดการที่อยู่จัดส่ง
 */

router.use(authenticate);

/**
 * @swagger
 * /addresses:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: ดูรายการที่อยู่ทั้งหมด
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /addresses:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: เพิ่มที่อยู่ใหม่
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - line1
 *               - province
 *               - postalCode
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: สมชาย ใจดี
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               line1:
 *                 type: string
 *                 example: 99/99 ถนนสุขุมวิท
 *               subDistrict:
 *                 type: string
 *                 example: คลองตัน
 *               district:
 *                 type: string
 *                 example: วัฒนา
 *               province:
 *                 type: string
 *                 example: กรุงเทพมหานคร
 *               postalCode:
 *                 type: string
 *                 example: "10110"
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: เพิ่มที่อยู่สำเร็จ
 */
router.post('/', controller.create);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     tags:
 *       - Addresses
 *     summary: แก้ไขที่อยู่
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
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     tags:
 *       - Addresses
 *     summary: ลบที่อยู่
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
 */
router.delete('/:id', controller.remove);

module.exports = router;