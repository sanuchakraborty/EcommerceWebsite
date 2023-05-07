const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { constants } = require("buffer");
const cloudinary = require("cloudinary");
const { log } = require("console");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, imageUrl } = req.body;
  console.log(imageUrl);
  if (req.body.avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      chunk_size: 50000000,
      folder: "avatar",
      width: 150,
      crop: "scale",
    });

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(user, 201, res);
  } else if (imageUrl) {
    const url = `${imageUrl}`;
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample_public_id",
        url,
      },
    });
    sendToken(user, 201, res);
  } else {
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample_public_id",
        url: "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-profile-line-black-icon-png-image_691065.jpg",
      },
    });

    sendToken(user, 201, res);
  }
});

// Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has put email and password both

  if (!email || !password) {
    return next(new ErrorHandler("PLease enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//Login User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

// Forgot Password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("You are not registered", 403));
  }

  const resetToken = await user.getPasswordResetToken();
  //console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // const url = `${req.protocol}://${req.get("host")}`;
  
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  const message = `Your password reset link is :\n\n${resetPasswordUrl}\n\nIf you have not requested, please ignore. Thank you`;
 
  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email has been sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordExpired = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordExpired,
    //resetPasswordToken: { $gt: Date.now()},
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Invalid Request or Reset password link has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords didn't match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();
  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password while logged in
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords didn't match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Update User Profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  // const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    name: user.name,
    email: user.email,
  });
});

// Get all users  -- Admin

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get single users for admin

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
});

// Delete User -- Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 404)
    );
  }
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await User.deleteOne(user);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
