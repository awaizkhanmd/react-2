const  userController= require("../controllers/userController")
const express  = require("express")
const { fetchuser}= require("../middlewares/fetchuser")
const router= express.Router();
const UserModel = require("../models/UserModel")


router.post("/createuser",userController.createuser)
router.post("/loginuser", userController.loginuser)
//router.post("/UserLoggedIn",fetchuser,  userController.UserLoggedIn)
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await UserModel.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports= router

;