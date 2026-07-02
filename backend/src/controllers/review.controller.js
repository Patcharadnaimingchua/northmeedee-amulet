const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const createReview = async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'คะแนนต้องอยู่ระหว่าง 1-5');
  }

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
        status: 'COMPLETED',
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new ApiError(400, 'ไม่พบคำสั่งซื้อที่เสร็จสมบูรณ์สำหรับรีวิวนี้');
    }

    const hasProduct = order.items.some(
      (item) => item.productId === productId
    );

    if (!hasProduct) {
      throw new ApiError(400, 'สินค้านี้ไม่อยู่ในคำสั่งซื้อดังกล่าว');
    }
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      productId,
      orderId,
      rating: Number(rating),
      comment,
    },
  });

  return success(res, 201, 'เพิ่มรีวิวสำเร็จ', review);
};

const getProductReviews = async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId: req.params.productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(res, 200, 'สำเร็จ', reviews);
};

const deleteReview = async (req, res) => {
  const where = {
    id: req.params.id,
  };

  if (req.user.role !== 'ADMIN') {
    where.userId = req.user.id;
  }

  const review = await prisma.review.findFirst({
    where,
  });

  if (!review) {
    throw new ApiError(404, 'ไม่พบรีวิว');
  }

  await prisma.review.delete({
    where: {
      id: review.id,
    },
  });

  return success(res, 200, 'ลบรีวิวสำเร็จ');
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
