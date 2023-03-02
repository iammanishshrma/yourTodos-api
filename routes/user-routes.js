const express = require("express");

const multer = require("multer");

const userController = require("../controllers/user-controllers");

const router = express.Router();
const upload = multer();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.get("/user-info", userController.getUserInfo);
router.put("/update-user", upload.none(), userController.updateUser);

module.exports = router;
