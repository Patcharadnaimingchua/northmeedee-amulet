const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { ApiError, success } = require('../utils/apiResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const register = async (req, res) => {
  const { email, password, name, phone } = req.body;

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    throw new ApiError(409, 'อีเมลนี้ถูกใช้งานแล้ว');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone
    }
  });

  await prisma.cart.create({
    data: {
      userId: user.id
    }
  });

  return success(res, 201, 'สมัครสมาชิกสำเร็จ', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  const payload = {
    id: user.id,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return success(res, 200, 'เข้าสู่ระบบสำเร็จ', {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, 'ไม่พบ Refresh Token');
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Refresh Token ไม่ถูกต้องหรือหมดอายุ');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Refresh Token ไม่ถูกต้อง');
  }

  const payload = {
    id: user.id,
    role: user.role
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: newRefreshToken
    }
  });

  return success(res, 200, 'ต่ออายุ Token สำเร็จ', {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
};

const logout = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      refreshToken: null
    }
  });

  return success(res, 200, 'ออกจากระบบสำเร็จ');
};

const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });

  return success(res, 200, 'ดึงข้อมูลผู้ใช้สำเร็จ', user);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
};
