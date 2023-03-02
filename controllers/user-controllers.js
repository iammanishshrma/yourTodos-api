const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user-modal");

const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.find({ email }).exec();
    if (existingUser.length !== 0) {
        const error = new HttpError(
            "User already exists with this email!!!",
            409
        );
        return next(error);
    }
    let hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new User({ name, email, password: hashedPassword });
    createdUser.save();
    res.json({ message: "User account created.", data: { name, email } });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
        const error = new HttpError(
            "User does not exists with this email!!!",
            404
        );
        return next(error);
    }

    const token = jwt.sign(
        {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
        },
        process.env.JWT_KEY
    );

    const result = await bcrypt.compare(password, existingUser.password);
    if (result) {
        res.json({
            message: "Logged in",
            token,
            userData: { name: existingUser.name, email: existingUser.email },
        });
    } else {
        res.status(409).json({ message: "Password not correct" });
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;

        const userId = await jwt.verify(authToken, process.env.JWT_KEY).id;

        const existingUser = await User.findById(userId).exec();
        const response = existingUser.toObject();
        delete response.password;
        res.json(response);
    } catch (error) {
        res.status(400).json("Some error occured");
    }
};

const updateUser = async (req, res, next) => {
    console.log(req.body);
    try {
        const authToken = req.headers.authorization;

        const userId = await jwt.verify(authToken, process.env.JWT_KEY).id;
        if (!userId) {
            res.status(400).json("User not found!!!");
        }

        const existingUser = await User.findById(userId).exec();
        const response = existingUser.toObject();
        delete response.password;
        res.json(response);
    } catch (error) {
        res.status(400).json("Some error occured");
    }
};

exports.signUp = signUp;
exports.login = login;
exports.getUserInfo = getUserInfo;
exports.updateUser = updateUser;
