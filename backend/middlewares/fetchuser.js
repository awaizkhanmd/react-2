const jwt = require("jsonwebtoken")

const JWT_SIGN = "eamplesignforjwt"


const fetchuser= function(req,res,next){
//get user uer from jwt token 
const token = req.headers["x-api-key"];
 if(!token)
 res.status(401).send({error:"  authentication failed"})
try{
    
 const data = jwt.verify(token,JWT_SIGN)
req.user=data.user
    next();
}
catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}
module.exports = {fetchuser  }




