const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }

  return cart;
};

const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  const items = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id
    },
    include: {
      product: {
        include: {
          images: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return success(res, 200, 'ดึงข้อมูลตะกร้าสำเร็จ', {
    items,
    total
  });
};

const addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });

  if (!product || !product.isActive) {
    throw new ApiError(404, 'ไม่พบสินค้า');
  }

  if (product.stock < Number(quantity)) {
    throw new ApiError(400, 'สินค้าคงเหลือไม่เพียงพอ');
  }

  const cart = await getOrCreateCart(req.user.id);

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  let item;

  if (existing) {
    item = await prisma.cartItem.update({
      where: {
        id: existing.id
      },
      data: {
        quantity: existing.quantity + Number(quantity)
      }
    });
  } else {
    item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: Number(quantity)
      }
    });
  }

  return success(res, 200, 'เพิ่มสินค้าลงตะกร้าสำเร็จ', item);
};

const updateItem = async (req, res) => {
  const { quantity } = req.body;

  const cart = await getOrCreateCart(req.user.id);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: req.params.itemId,
      cartId: cart.id
    },
    include: {
      product: true
    }
  });

  if (!item) {
    throw new ApiError(404, 'ไม่พบรายการในตะกร้า');
  }

  if (Number(quantity) > item.product.stock) {
    throw new ApiError(400, 'สินค้าคงเหลือไม่เพียงพอ');
  }

  const updated = await prisma.cartItem.update({
    where: {
      id: item.id
    },
    data: {
      quantity: Number(quantity)
    }
  });

  return success(res, 200, 'แก้ไขจำนวนสินค้าสำเร็จ', updated);
};

const removeItem = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: req.params.itemId,
      cartId: cart.id
    }
  });

  if (!item) {
    throw new ApiError(404, 'ไม่พบรายการในตะกร้า');
  }

  await prisma.cartItem.delete({
    where: {
      id: item.id
    }
  });

  return success(res, 200, 'ลบสินค้าออกจากตะกร้าสำเร็จ');
};

const clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id
    }
  });

  return success(res, 200, 'ล้างตะกร้าสำเร็จ');
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getOrCreateCart
};
