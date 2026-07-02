const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const uploadSlip = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log('========== Upload Slip ==========');
    console.log('Order ID :', orderId);
    console.log('User ID  :', req.user.id);
    console.log('File     :', req.file);

    const payment = await prisma.payment.findFirst({
      where: {
        order: {
          id: orderId,
          userId: req.user.id,
        },
      },
    });

    if (!payment) {
      throw new ApiError(404, 'ไม่พบรายการชำระเงิน');
    }

    if (!req.file) {
      throw new ApiError(400, 'กรุณาอัปโหลดสลิป');
    }

    const updated = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        slipUrl: req.file.path,
        slipPublicId: req.file.filename,
        status: 'SUBMITTED',
      },
    });

    return success(res, 200, 'อัปโหลดสลิปสำเร็จ', updated);

  } catch (err) {
    console.error('========== Upload Slip Error ==========');
    console.error(err);
    throw err;
  }
};

const getAllPayments = async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(res, 200, 'สำเร็จ', payments);
};

const reviewPayment = async (req, res) => {
  const { status, note } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new ApiError(400, 'สถานะไม่ถูกต้อง');
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!payment) {
    throw new ApiError(404, 'ไม่พบรายการชำระเงิน');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const paymentUpdated = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status,
        note,
        approvedAt: status === 'APPROVED' ? new Date() : null,
        rejectedAt: status === 'REJECTED' ? new Date() : null,
      },
    });

    await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        status: status === 'APPROVED'
          ? 'PAID'
          : 'WAITING_PAYMENT',
      },
    });

    return paymentUpdated;
  });

  return success(res, 200, 'ตรวจสอบการชำระเงินสำเร็จ', updated);
};

module.exports = {
  uploadSlip,
  getAllPayments,
  reviewPayment,
};