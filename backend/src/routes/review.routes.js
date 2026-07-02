const router = require('express').Router();

const controller = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: รีวิวสินค้าและคะแนน
 */

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: ดูรีวิวของสินค้า
 *     description: แสดงรีวิวทั้งหมดของสินค้าที่เลือก
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: e9bf0d13-2122-494d-bc9f-ce6a59dc6112
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบสินค้า
 */
router.get(
  '/product/:productId',
  controller.getProductReviews
);

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: เพิ่มรีวิวสินค้า
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
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *                 example: e9bf0d13-2122-494d-bc9f-ce6a59dc6112
 *               orderId:
 *                 type: string
 *                 nullable: true
 *                 example: 4c4a27e2-fd48-4f67-a7f0-4e6cb70b4d4d
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: พระสวยตรงปก ส่งเร็วมาก
 *     responses:
 *       201:
 *         description: เพิ่มรีวิวสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  controller.createReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: ลบรีวิว
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: c6a5c6d2-85af-48d3-aed9-dc5b9cfc80fd
 *     responses:
 *       200:
 *         description: ลบรีวิวสำเร็จ
 *       404:
 *         description: ไม่พบรีวิว
 */
router.delete(
  '/:id',
  authenticate,
  controller.deleteReview
);

module.exports = router;