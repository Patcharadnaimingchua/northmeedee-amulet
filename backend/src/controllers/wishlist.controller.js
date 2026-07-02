const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const getWishlist = async (req, res) => {
  const items = await prisma.wishlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(res, 200, 'สำเร็จ', items);
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new ApiError(404, 'ไม่พบสินค้า');
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });

  if (existing) {
    throw new ApiError(409, 'สินค้านี้อยู่ในรายการโปรดแล้ว');
  }

  const item = await prisma.wishlist.create({
    data: {
      userId: req.user.id,
      productId,
    },
  });

  return success(res, 201, 'เพิ่มในรายการโปรดสำเร็จ', item);
};

const removeFromWishlist = async (req, res) => {
  const item = await prisma.wishlist.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!item) {
    throw new ApiError(404, 'ไม่พบรายการโปรด');
  }

  await prisma.wishlist.delete({
    where: {
      id: item.id,
    },
  });

  return success(res, 200, 'ลบออกจากรายการโปรดสำเร็จ');
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
