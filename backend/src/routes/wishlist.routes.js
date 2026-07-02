const router = require('express').Router();

const controller = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: รายการโปรดของผู้ใช้
 */

router.use(authenticate);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: ดูรายการโปรด
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', controller.getWishlist);

/**
 * @swagger
 * /wishlist:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: เพิ่มสินค้าเข้ารายการโปรด
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
 *     responses:
 *       201:
 *         description: เพิ่มสำเร็จ
 *       409:
 *         description: มีสินค้าอยู่แล้วในรายการโปรด
 */
router.post('/', controller.addToWishlist);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: ลบสินค้าออกจากรายการโปรด
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 7cbe86df-3b4c-4b5c-9bfa-9e08f67c2d77
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *       404:
 *         description: ไม่พบรายการโปรด
 */
router.delete('/:id', controller.removeFromWishlist);

module.exports = router;