const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const getAll = async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      isDefault: 'desc',
    },
  });

  return success(res, 200, 'สำเร็จ', addresses);
};

const create = async (req, res) => {
  const {
    fullName,
    phone,
    line1,
    subDistrict,
    district,
    province,
    postalCode,
    isDefault,
  } = req.body;

  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: req.user.id,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: req.user.id,
      fullName,
      phone,
      line1,
      subDistrict,
      district,
      province,
      postalCode,
      isDefault: !!isDefault,
    },
  });

  return success(res, 201, 'เพิ่มที่อยู่สำเร็จ', address);
};

const update = async (req, res) => {
  const address = await prisma.address.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!address) {
    throw new ApiError(404, 'ไม่พบที่อยู่');
  }

  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: req.user.id,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const updated = await prisma.address.update({
    where: {
      id: address.id,
    },
    data: req.body,
  });

  return success(res, 200, 'แก้ไขที่อยู่สำเร็จ', updated);
};

const remove = async (req, res) => {
  const address = await prisma.address.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!address) {
    throw new ApiError(404, 'ไม่พบที่อยู่');
  }

  await prisma.address.delete({
    where: {
      id: address.id,
    },
  });

  return success(res, 200, 'ลบที่อยู่สำเร็จ');
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
