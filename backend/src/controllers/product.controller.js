const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');
const { slugify } = require('./category.controller');
const { cloudinary } = require('../config/cloudinary');

const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    categoryId,
    province,
    era,
    minPrice,
    maxPrice,
    sort = 'newest',
  } = req.query;

  const where = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { temple: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) where.categoryId = categoryId;
  if (province) where.province = province;
  if (era) where.era = era;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const orderByMap = {
    newest: { createdAt: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    name_asc: { name: 'asc' },
  };

  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      orderBy: orderByMap[sort] || orderByMap.newest,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return success(res, 200, 'สำเร็จ', items, {
    page: Number(page),
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
  });
};

const getOne = async (req, res) => {
  const id = req.params.id;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      reviews: {
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
      },
    },
  });

  if (!product) throw new ApiError(404, 'ไม่พบสินค้า');

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  return success(res, 200, 'สำเร็จ', {
    ...product,
    avgRating: Number(avgRating.toFixed(1)),
  });
};

const create = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    material,
    temple,
    province,
    era,
    categoryId,
  } = req.body;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) throw new ApiError(400, 'ไม่พบหมวดหมู่');

  const product = await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now()}`,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      material,
      temple,
      province,
      era,
      categoryId: categoryId,
    },
  });

  if (req.files?.length) {
    await prisma.productImage.createMany({
      data: req.files.map((file, index) => ({
        productId: product.id,
        url: file.path,
        publicId: file.filename,
        isPrimary: index === 0,
      })),
    });
  }

  const full = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      images: true,
      category: true,
    },
  });

  return success(res, 201, 'เพิ่มสินค้าสำเร็จ', full);
};

const update = async (req, res) => {
  const id = req.params.id;

  const {
    name,
    description,
    price,
    stock,
    material,
    temple,
    province,
    era,
    categoryId,
    isActive,
  } = req.body;

  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) throw new ApiError(404, 'ไม่พบสินค้า');

  const data = {
    description,
    material,
    temple,
    province,
    era,
  };

  if (name) data.name = name;
  if (price !== undefined) data.price = Number(price);
  if (stock !== undefined) data.stock = Number(stock);
  if (categoryId) data.categoryId = categoryId;
  if (isActive !== undefined) data.isActive = isActive === true || isActive === 'true';

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  if (req.files?.length) {
    await prisma.productImage.createMany({
      data: req.files.map((file) => ({
        productId: product.id,
        url: file.path,
        publicId: file.filename,
        isPrimary: false,
      })),
    });
  }

  const full = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      images: true,
      category: true,
    },
  });

  return success(res, 200, 'แก้ไขสินค้าสำเร็จ', full);
};

const remove = async (req, res) => {
  const id = req.params.id;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) throw new ApiError(404, 'ไม่พบสินค้า');

  for (const image of product.images) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      console.error(err.message);
    }
  }

  await prisma.product.delete({
    where: { id },
  });

  return success(res, 200, 'ลบสินค้าสำเร็จ');
};

const removeImage = async (req, res) => {
  const imageId = req.params.imageId;

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image) throw new ApiError(404, 'ไม่พบรูปภาพ');

  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (err) {
    console.error(err.message);
  }

  await prisma.productImage.delete({
    where: { id: imageId },
  });

  return success(res, 200, 'ลบรูปภาพสำเร็จ');
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  removeImage,
};
