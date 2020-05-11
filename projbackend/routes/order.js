const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {
  getOrderById,
  createOrder,
  getAllOrders,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes

router.post(
  "/order/createOrder/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);
module.exports = router;
