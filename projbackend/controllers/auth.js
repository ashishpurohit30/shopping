const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");


//Controller for SignUp Route
exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save the User in DB!",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};


//Controller for SignIn Route
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err)
      return res.status(400).json({
        error: "User email doesn't exist",
      });

    if (!user)
      return res.status(400).json({
        error: "User Doesn't Exist",
      });

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Passowords do not Match",
      });
    }
    //Create a JWT to be sent to the user Cookie to store the user data in Browser Cookie
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //Put Token in User Cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //Send Response to Front End [Token,Name,Email,Role]
    const { _id, name, email, role } = user;  //This is Object De Structuring
    return res.json({ token, user: { _id, name, email, role } });
  });
};


//Controller for SignOut Route
exports.signout = (req, res) => {
  res.clearCookie("token"); //Clearing all the Cookies stored for the particular User
  res.json({
    message: "User Signed Out Successfully",
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
  //Passing the JWT Options
  secret: process.env.SECRET,
  userProperty: "auth",
});
//Custom Middlewares

//MiddleWare to check if the user is Authenticated
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

//MiddleWare to check if the user is Admin [0=Default,1=Admin]
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).json({
      error: "The user doesn't have Admin Privileges. Access Denied",
    });
  next();
};
