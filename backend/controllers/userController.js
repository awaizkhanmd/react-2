const {
    body,
    validationResult
} = require("express-validator");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SIGN = "eamplesignforjwt";

let isValid = function (value) {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    if (typeof value === "number") return false;
    return true;
};
const isValidPassword = (value) => {
    if (typeof value === "undefined" || value === null) return false;
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    return re.test(value);
};
const createuser = async function (req, res) {
    try {
        let success = false;
        let data = req.body;
        const {
            name,
            email,
            password
        } = data;
        if (!Object.keys(data).length)
            return res
                .status(400)
                .send({
                    status: false,
                    message: "You must enter data"
                });

        if (!isValid(name)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "please enter name with a valid string",
                });
        }

        // if (!/^[a-zA-Z ]{2,30}$/.test(data.name.trim())) {
        //     return res
        //         .status(400)
        //         .send({
        //             status: false,
        //             message: "Enter a valid  name."
        //         });
        // }

        if (!isValid(email)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "please enter email with a valid string",
                });
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "Enter a valid email address."
                });
        }

        let Email = await UserModel.findOne({
            email
        });

        if (Email) {
            return res
                .status(400)
                .json({ 
                    status: false,
                    message: "email already registerd"
                });
        }
        if (!isValidPassword(password)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "password is not valid password should contain  8 -15,one lower case and upper case letter with special character",
                });
        }
        let saltRounds = 8;
        const encryptPassword = await bcrypt.hash(password, saltRounds);

        let savedData = await UserModel.create({
            name: name,
            email: email,
            password: encryptPassword,
        });
        const Data = {
            savedData: {
                id: savedData.id,
            },
        };

        const jwtData = jwt.sign(Data, JWT_SIGN);
        success = true;
        res.json({
            sucess,
            jwtData
           
        });


    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }
};
const loginuser = async function (req, res) {
    try {
        let data = req.body;
        const {
            email,
            password
        } = data;
        if (!Object.keys(data).length)
            return res
                .status(400)
                .send({
                    status: false,
                    message: "You must enter data"
                });

        let user = await UserModel.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                error: "user does not exits"
            });
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res
                .status(400)
                .json({
                    error: "password not matched with data base"
                });
        }

        const Data = {
            user: {
                id: user._id,
            },
        };

        const jwtData = jwt.sign(Data, JWT_SIGN);
        res.json({
            jwtData
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

const UserLoggedIn = async function (res, req) {
    try {

        userId = req.user._id;
        const user = await UserModel.findOne({ _id: user }).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        //res.status(500).send("Internal Server Error");
    }
}


module.exports = {
    createuser,
    loginuser,
    UserLoggedIn,
};