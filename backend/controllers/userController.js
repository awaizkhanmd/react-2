

const UserModel = require("../models/UserModel")

const createuser = async function (req, res) {
    try {
        let data = req.body
      
        let savedData = await UserModel.create(data)

        return res.status(201).send({ status: true, message: "User created successfully", data: savedData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};


module.exports = {
    createuser
}