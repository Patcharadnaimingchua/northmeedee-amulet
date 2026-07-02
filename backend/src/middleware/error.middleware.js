const { ApiError } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  next(new ApiError(404, `ไม่พบ Route: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';
  let errors = err.errors || [];

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'ข้อมูลนี้มีอยู่แล้ว';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'ไม่พบข้อมูล';
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

module.exports = {
  notFound,
  errorHandler
};
