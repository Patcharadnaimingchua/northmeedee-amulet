const router = require('express').Router();

const controller = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: จัดการตะกร้าสินค้า
 */

router.use(authenticate);

/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: ดูตะกร้าสินค้า
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', controller.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: เพิ่มสินค้าลงตะกร้า
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: e9bf0d13-2122-494d-bc9f-ce6a59dc6112
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: เพิ่มสินค้าสำเร็จ
 */
router.post('/items', controller.addItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: แก้ไขจำนวนสินค้า
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 */
router.put('/items/:itemId', controller.updateItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: ลบสินค้าออกจากตะกร้า
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 */
router.delete('/items/:itemId', controller.removeItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: ล้างตะกร้าสินค้าทั้งหมด
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ล้างตะกร้าสำเร็จ
 */
router.delete('/', controller.clearCart);

module.exports = router;