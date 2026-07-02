const router = require('express').Router();

const controller = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { uploadSlip } = require('../middleware/upload.middleware');

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: จัดการการชำระเงิน
 */

router.use(authenticate);

/**
 * @swagger
 * /payments/{orderId}/slip:
 *   post:
 *     tags:
 *       - Payments
 *     summary: อัปโหลดสลิปการโอนเงิน
 *     description: รองรับ PromptPay และ Bank Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5c76d86c-d87d-4c42-a51d-3c79fd98f9b5
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - slip
 *             properties:
 *               slip:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: อัปโหลดสลิปสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 */
router.post(
  '/:orderId/slip',
  uploadSlip,
  controller.uploadSlip
);

/**
 * @swagger
 * /payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: (Admin) ดูรายการชำระเงินทั้งหมด
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get(
  '/',
  requireRole('ADMIN'),
  controller.getAllPayments
);

/**
 * @swagger
 * /payments/{id}/review:
 *   put:
 *     tags:
 *       - Payments
 *     summary: (Admin) อนุมัติหรือปฏิเสธการชำระเงิน
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
 *                   - APPROVED
 *                   - REJECTED
 *               note:
 *                 type: string
 *                 example: ตรวจสอบเรียบร้อย
 *     responses:
 *       200:
 *         description: ตรวจสอบการชำระเงินสำเร็จ
 */
router.put(
  '/:id/review',
  requireRole('ADMIN'),
  controller.reviewPayment
);

module.exports = router;