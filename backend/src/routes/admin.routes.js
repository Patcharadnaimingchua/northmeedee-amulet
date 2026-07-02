const router = require('express').Router();

const controller = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Dashboard และข้อมูลสรุปสำหรับผู้ดูแลระบบ
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Dashboard ผู้ดูแลระบบ
 *     description: |
 *       แสดงข้อมูลสรุปของระบบ เช่น
 *       - จำนวนผู้ใช้
 *       - จำนวนสินค้า
 *       - จำนวนคำสั่งซื้อ
 *       - รายได้รวม
 *       - สินค้าใกล้หมด
 *       - รายได้ย้อนหลัง
 *       - จำนวนคำสั่งซื้อแยกตามสถานะ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: สำเร็จ
 *               data:
 *                 totalUsers: 120
 *                 totalProducts: 35
 *                 totalOrders: 210
 *                 totalRevenue: 185000
 *                 ordersByStatus:
 *                   - status: COMPLETED
 *                     _count:
 *                       _all: 95
 *                   - status: SHIPPING
 *                     _count:
 *                       _all: 14
 *                 revenueByDay:
 *                   "2026-07-01": 8500
 *                   "2026-07-02": 12000
 *                 lowStockProducts:
 *                   - id: "e9bf0d13-2122-494d-bc9f-ce6a59dc6112"
 *                     name: "พระกริ่ง รุ่นมหามงคล"
 *                     stock: 2
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin Only
 */

router.get(
  '/dashboard',
  authenticate,
  requireRole('ADMIN'),
  controller.dashboard
);

module.exports = router;