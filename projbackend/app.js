require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//Connecting to the Database using the mongoose.connect method
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    //If the connection is Successful
    console.log("DB CONNECTED");
  })
  //If the connection is not successful
  .catch(console.log("DB GOT ERROR"));

//MiddleWares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//All the routes will be appended with /api
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//Port
const port = process.env.PORT || 8000;

//Starting the Server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
