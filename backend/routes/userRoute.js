const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedRoles, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/auth").get(isAuthenticated);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgetPassword);

router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

module.exports = router;
