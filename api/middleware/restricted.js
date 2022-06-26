const { JWT_SECRET } = require('../../secrets');
const jwt = require('jsonwebtoken');
const Users = require('../auth/users-model');

function restrict (req, res, next)  {
 
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 const token = req.headers.authorization;
 
 if (token == null){
  res.status(400).json({message: "token required"})
  return;
 }
 jwt.verify(token, JWT_SECRET, (err, decoded) =>{
  if (err){
    res.status(401).json({message: 'Token invalid'});
    return;
  }
  else {
  req.decoded = decoded;
  next();
  }
})
}

function checkInput (req,res,next) {
  if (req.body.username == null || req.body.password == null){
    res.status(400).json({message: "username and password required"});
} else {
  next();
}
}

function checkUsername(req, res, next){
  const {username} = req.body;
  Users.findBy({username})
  .then(user =>{
    if (!user){
      res.status(400).json({message: "invalid credentials"})
      return;
    }
    req.user = user;
    next();
  })
}

module.exports = {
  restrict,
  checkInput,
  checkUsername
}
