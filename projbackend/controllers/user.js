const User = require("../models/user");
const Order = require("../models/order");

//Controller Method to get User by passing id as a param//
exports.getUserById = (req,res,next,id) =>{
  User.findById(id).exec((err, user) =>{
    if(err || !user)
    {
     return res.status(400).json({
       error : "No User was found in the Database"
     })
    }
    req.profile = user;
    next();
  })
}

exports.getUser = (req, res) =>{
  //TODO : get back here for password
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req,res) => {
  User.findByIdAndUpdate(
    {_id : req.profile._id},
    {$set : req.body},
    {new : true, useFindAndModify : false},
    (err, user) =>{
      if(err || !user)
      return res.status(400).json({
        error :  "You're not Authorized to update this User"
      })
      console.log(user, " saknsabkbc");
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      return res.json(user)
    }
  )
}

exports.userPurchaseList = (req,res) =>
{
  Order.find({user : req.profile._id})
  .populate("user" , "_id name")
  .exec((err, order) => {
    if(err)
    {
      return res.status(400).json({
        error : "No order in this account"
      })
    }
    return res.json(order)
  })
}