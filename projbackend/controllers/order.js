const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Orders found in DB",
        });
      }
      req.order = order;
      next();
    });
};

//Create Order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your Order information in the Database",
      });
    }
    res.json(order);
  });
};

//Get All Orders
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name ")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "Cannot Find All Orders",
        });
      }
      res.json(order);
    });
};
