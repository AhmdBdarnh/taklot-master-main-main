const express = require('express');
const router = express.Router();
const userController = require('../../controllers/usersController/usersControllers');
//user


router.get("/user/:id", userController.getUserByID);
router.get("/users", userController.getAllUsers);
router.post("/signup/helpseeker", userController.user_post);
router.put("/user/:id", userController.user_update);
router.delete("/user/:id", userController.user_delete);

router.get("/signup/helpseeker",userController.getSignup);
router.get("/login",userController.getLogin);

router.post("/login",userController.post_Login);
router.get("/home/helpseeker", userController.getUserPage);



module.exports = router;