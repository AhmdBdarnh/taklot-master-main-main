const express = require('express');
const router = express.Router();
const technicalController = require('../../controllers/technicalController/technicalcontroller');
//technical
router.get("/technical/:id", technicalController.getTechincalByID);
router.get("/technical", technicalController.getAllTechincal);
router.put("/technical/:id", technicalController.techincal_update);
router.delete("/deleteOffer", technicalController.deleteOffer);


router.get("/home/technical", technicalController.getTechPage);

router.get("/signup/technical",technicalController.getSignup);
router.post("/signup/technical", technicalController.techincal_post);

module.exports = router;
