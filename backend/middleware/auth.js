const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to access", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(200).json({
      success: false,
      isAuthenticated: false,
      user: null,
    });
  }else{
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  {
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: req.user,
    });
  }}
});

exports.authorizedRoles = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} role is not allowed to access`),
        403
      );
    }

    next();
  };
};
