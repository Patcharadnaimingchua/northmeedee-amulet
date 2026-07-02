const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, '')
    .replace(/\s+/g, '-');

const getAll = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return success(res, 200, 'ดึงข้อมูลหมวดหมู่สำเร็จ', categories);
};

const getOne = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: req.params.id
    }
  });

  if (!category) {
    throw new ApiError(404, 'ไม่พบหมวดหมู่');
  }

  return success(res, 200, 'ดึงข้อมูลหมวดหมู่สำเร็จ', category);
};

const create = async (req, res) => {
  const { name, description } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      description,
      slug: slugify(name)
    }
  });

  return success(res, 201, 'สร้างหมวดหมู่สำเร็จ', category);
};

const update = async (req, res) => {
  const { name, description } = req.body;

  const data = {
    description
  };

  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }

  const category = await prisma.category.update({
    where: {
      id: req.params.id
    },
    data
  });

  return success(res, 200, 'แก้ไขหมวดหมู่สำเร็จ', category);
};

const remove = async (req, res) => {
  await prisma.category.delete({
    where: {
      id: req.params.id
    }
  });

  return success(res, 200, 'ลบหมวดหมู่สำเร็จ');
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  slugify
};
