const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not Found",
        });
      }
      req.product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to parse the selected image",
      });
    }

    //Destructuring the Fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res
        .status(400)
        .json({ error: "Please fill all the required fields" });
    }

    //TODO restrictions
    let product = new Product(fields);

    //File Handling
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File Size must be less than 3MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //DB Save
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to save Product in the Database",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  console.log(req, "Req Object from getProduct");
  req.product.photo = undefined;
  return res.json(req.product);
};

//Middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//Delete Controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Selected Product Cannot be deleted from the Database!",
      });
    }
    console.log(deletedProduct, "DeletedProduct");
    res.json({
      message: `The Selected ${deleteProduct.name} was successfully Deleted`,
    });
  });
};

//Update Controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to parse the selected image",
      });
    }

    //Updation Code Using Lodash
    let product = req.product;
    product = _.extend(product, fields);

    //File Handling
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File Size must be less than 3MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //DB Save
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to update Product in the Database",
        });
      }
      res.json(product);
    });
  });
};

//Listing Controller
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("categpry")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to fetch the Products from the Database",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category",{}, (err,category)=>{
    if(err)
    {
      res.status(400).json({
        error : "No Unique Categories found"
      })
    }
    res.json(category);
  })
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operations Failed",
      });
    }
    console.log(products, "Products from Bulk Update Query");
    next();
  });
};
