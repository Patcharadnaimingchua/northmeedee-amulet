const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');
const { getOrCreateCart } = require('./cart.controller');
const { generateOrderNumber } = require('../utils/orderNumber');

const SHIPPING_FEE = 50;

const checkout = async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: req.user.id },
  });
  if (!address) throw new ApiError(404, 'ไม่พบที่อยู่จัดส่งที่ระบุ');

  const cart = await getOrCreateCart(req.user.id);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });
  if (items.length === 0) throw new ApiError(400, 'ตะกร้าสินค้าว่างเปล่า');

  for (const item of items) {
    if (item.quantity > item.product.stock) {
      throw new ApiError(400, `สินค้า "${item.product.name}" คงเหลือไม่เพียงพอ`);
    }
  }

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  );
  const total = subtotal + SHIPPING_FEE;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        addressId,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        status: 'WAITING_PAYMENT',
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
        },
        payment: {
          create: {
            method:
              paymentMethod === 'BANK_TRANSFER'
                ? 'BANK_TRANSFER'
                : 'PROMPTPAY',
            amount: total,
            status: 'PENDING',
          },
        },
      },
      include: {
        items: true,
        payment: true,
        address: true,
      },
    });

    for (const i of items) {
      await tx.product.update({
        where: { id: i.productId },
        data: {
          stock: {
            decrement: i.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return newOrder;
  });

  return success(res, 201, 'สร้างคำสั่งซื้อสำเร็จ', order);
};

const getMyOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      payment: true,
      address: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return success(res, 200, 'สำเร็จ', orders);
};

const getOrderDetail = async (req, res) => {
  const where = {
    id: req.params.id,
  };

  if (req.user.role !== 'ADMIN') {
    where.userId = req.user.id;
  }

  const order = await prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      payment: true,
      address: true,
      user: true,
    },
  });

  if (!order) throw new ApiError(404, 'ไม่พบคำสั่งซื้อ');

  return success(res, 200, 'สำเร็จ', order);
};

const cancelOrder = async (req, res) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: {
      items: true,
    },
  });

  if (!order) throw new ApiError(404, 'ไม่พบคำสั่งซื้อ');

  if (!['PENDING', 'WAITING_PAYMENT'].includes(order.status)) {
    throw new ApiError(400, 'ไม่สามารถยกเลิกคำสั่งซื้อในสถานะนี้ได้');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
      },
    });

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
  });

  return success(res, 200, 'ยกเลิกคำสั่งซื้อสำเร็จ');
};

const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const where = {};

  if (status) {
    where.status = status;
  }

  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        payment: true,
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    }),
    prisma.order.count({
      where,
    }),
  ]);

  return success(res, 200, 'สำเร็จ', items, {
    page: Number(page),
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
  });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    'PENDING',
    'WAITING_PAYMENT',
    'PAID',
    'PACKING',
    'SHIPPING',
    'COMPLETED',
    'CANCELLED',
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'สถานะไม่ถูกต้อง');
  }

  const order = await prisma.order.update({
    where: {
      id: req.params.id,
    },
    data: {
      status,
    },
  });

  return success(res, 200, 'อัปเดตสถานะสำเร็จ', order);
};

module.exports = {
  checkout,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
