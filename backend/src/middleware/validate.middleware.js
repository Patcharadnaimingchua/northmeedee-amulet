const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'ข้อมูลไม่ถูกต้อง', errors.array()));
  }

  next();
};

module.exports = { validate };
