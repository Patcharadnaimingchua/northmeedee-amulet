const prisma = require('../config/db');
const { success } = require('../utils/apiResponse');

const dashboard = async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    orders,
    lowStock,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: 'USER',
      },
    }),

    prisma.product.count(),

    prisma.order.count(),

    prisma.order.findMany({
      where: {
        status: {
          in: ['PAID', 'PACKING', 'SHIPPING', 'COMPLETED'],
        },
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          lte: 3,
        },
        isActive: true,
      },
      take: 10,
      orderBy: {
        stock: 'asc',
      },
    }),
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
  });

  // Revenue ย้อนหลัง 14 วัน
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: since,
      },
      status: {
        in: ['PAID', 'PACKING', 'SHIPPING', 'COMPLETED'],
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const revenueByDay = {};

  for (const order of recentOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDay[key] =
      (revenueByDay[key] || 0) + Number(order.total);
  }

  return success(res, 200, 'สำเร็จ', {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    revenueByDay,
    lowStockProducts: lowStock,
  });
};

module.exports = {
  dashboard,
};
