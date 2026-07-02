const router = require('express').Router();
const { body } = require('express-validator');

const controller = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadProductImages } = require('../middleware/upload.middleware');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: จัดการสินค้า (พระเครื่อง)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: ค้นหารายการสินค้า
 *     description: รองรับ Search, Filter และ Pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: era
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - price_asc
 *             - price_desc
 *             - name_asc
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: รายละเอียดสินค้า
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
 *         description: ไม่พบสินค้า
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: เพิ่มสินค้า
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               material:
 *                 type: string
 *               temple:
 *                 type: string
 *               province:
 *                 type: string
 *               era:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: เพิ่มสินค้าสำเร็จ
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  uploadProductImages,
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('categoryId').notEmpty(),
  ],
  validate,
  controller.create
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: แก้ไขสินค้า
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               material:
 *                 type: string
 *               temple:
 *                 type: string
 *               province:
 *                 type: string
 *               era:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 */
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  uploadProductImages,
  controller.update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: ลบสินค้า
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
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  controller.remove
);

/**
 * @swagger
 * /products/images/{imageId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: ลบรูปสินค้า
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบรูปสำเร็จ
 */
router.delete(
  '/images/:imageId',
  authenticate,
  requireRole('ADMIN'),
  controller.removeImage
);

module.exports = router;