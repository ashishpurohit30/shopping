var express = require("express");
var router = express.Router();
const { signout , signup , signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");


//SignUp Route
router.post(
  "/signup",
  [
    //Checking for validations on [name,email,password]
    check("name", "Name Should be of at least 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be of at least 3 characters").isLength({
      min: 3,
    }),
  ],
  signup //Calling the SignUp Controller
);

//SignIn Route
router.post(
  "/signin",
  [
    //Checking for email and password
    check("email", "Email is required").isEmail(),
    check("password", "Password Field is Required").isLength({ min: 3}),
  ],
  signin //Passing the signIn controller
);

//Sign Out Route
router.get("/signout", signout);


//Test Route having isSignedIn as a Middleware where a JWT is passed
router.get("/testroute" , isSignedIn, (req,res) => {
  res.json(req.auth);
})

module.exports = router;
