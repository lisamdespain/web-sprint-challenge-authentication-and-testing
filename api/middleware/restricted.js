const { JWT_SECRET } = require('../../secrets');
const jwt = require('jsonwebtoken');
const Users = require('../auth/users-model');

function restrict (req, res, next)  {
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
}

function checkInput (req,res,next) {
  if (req.body.username == null || req.body.password == null){
    res.status(400).json({message: "username and password required"});
} else {
  next();
}
}

module.exports = {
  restrict,
  checkInput,
}
