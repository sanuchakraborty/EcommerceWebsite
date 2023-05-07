const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
//Create a product -- for Admin only
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const imagesLinks = [];
  if (req.body.imageLink1) {
    imagesLinks.push({
      public_id: "sample_id",
      url: req.body.imageLink1,
    });
  }
  if (req.body.imageLink2) {
    imagesLinks.push({
      public_id: "sample_id",
      url: req.body.imageLink2,
    });
  }
  if (req.body.imageLink3) {
    imagesLinks.push({
      public_id: "sample_id",
      url: req.body.imageLink3,
    });
  }
  if (req.body.images) {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    for (let i = 0; i < images.length; i++) {
      const imageUpload = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: imageUpload.public_id,
        url: imageUpload.secure_url,
      });
    }
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.name;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const totalProductsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  const productsCount = products.length;

  products = await apiFeature.pagination(resultPerPage).query.clone();

  res.status(200).json({
    success: true,
    products,
    totalProductsCount,
    productsCount,
    resultPerPage,
  });
});
//Get all products(Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

//Get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update a product -- for admin only
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  }
  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const imageUpload = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: imageUpload.public_id,
      url: imageUpload.secure_url,
    });
  }
  req.body.images = imagesLinks;
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete a Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  for (let i = 0; i < product.images.length; i++) {
    if (product.images[i].public_id !== "sample_id")
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.deleteOne(product);

  res.status(200).json({
    success: true,
    message: "Deleted",
  });
});

// Create or Update Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    image: req.user.avatar.url,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avgRating = 0;

  product.reviews.forEach((rev) => {
    avgRating += rev.rating;
  });
  if (product.reviews.length !== 0) {
    product.ratings = avgRating / product.reviews.length;
  } else {
    product.ratings = 0;
  }

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of A Product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// Delete a review (admin)
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avgRating = 0;

  reviews.forEach((rev) => {
    avgRating += rev.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avgRating / reviews.length;
  }
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
});
