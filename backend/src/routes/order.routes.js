const router = require('express').Router();

const controller = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: จัดการคำสั่งซื้อ
 */

router.use(authenticate);

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Checkout สร้างคำสั่งซื้อ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *               - paymentMethod
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: 2fbb0f7c-27e8-4d52-b92b-a93dcf6d8b74
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - PROMPTPAY
 *                   - BANK_TRANSFER
 *     responses:
 *       201:
 *         description: สร้างคำสั่งซื้อสำเร็จ
 *       400:
 *         description: ตะกร้าว่าง หรือสินค้าไม่พอ
 */
router.post('/checkout', controller.checkout);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     tags:
 *       - Orders
 *     summary: ดูคำสั่งซื้อของตัวเอง
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/my', controller.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: ดูรายละเอียดคำสั่งซื้อ
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
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 */
router.get('/:id', controller.getOrderDetail);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     tags:
 *       - Orders
 *     summary: ยกเลิกคำสั่งซื้อ
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
 *         description: ยกเลิกสำเร็จ
 */
router.post('/:id/cancel', controller.cancelOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: (Admin) ดูรายการคำสั่งซื้อทั้งหมด
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get(
  '/',
  requireRole('ADMIN'),
  controller.getAllOrders
);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: (Admin) เปลี่ยนสถานะคำสั่งซื้อ
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - WAITING_PAYMENT
 *                   - PAID
 *                   - PACKING
 *                   - SHIPPING
 *                   - COMPLETED
 *                   - CANCELLED
 *     responses:
 *       200:
 *         description: อัปเดตสถานะสำเร็จ
 */
router.put(
  '/:id/status',
  requireRole('ADMIN'),
  controller.updateOrderStatus
);

module.exports = router;