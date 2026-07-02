const { ApiError } = require('../utils/apiResponse');

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้'));
  }

  next();
};

module.exports = { requireRole };
