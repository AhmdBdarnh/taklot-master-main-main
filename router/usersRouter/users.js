const express = require('express');
const router = express.Router();
const userController = require('../../controllers/usersController/usersControllers');
//user


router.get("/user/:id", userController.getUserByID);
router.get("/users", userController.getAllUsers);
router.put("/user/:id", userController.user_update);
router.delete("/user/:id", userController.user_delete);

router.get("/signup/helpseeker",userController.getSignup);
router.post("/signup/helpseeker", userController.user_post);

router.get("/login",userController.getLogin);
router.post("/login",userController.post_Login);
router.get("/home/helpseeker", userController.getUserPage);

router.get("/home/helpseeker/requests", userController.getRequests);


router.get("/home/Profile", userController.getProfile);





module.exports = router;