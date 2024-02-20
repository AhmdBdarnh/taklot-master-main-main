const express = require('express');
const router = express.Router();
const reqController = require('../../controllers/requsetController/requestcontrller');
const upload = require('../../middleware/upload'); 

//request
router.get("/request/:id", reqController.getReqByID);
router.get("/request", reqController.getAllReq);
router.post("/request", reqController.request_post);
router.put("/request/:id", reqController.req_update);
router.delete("/request/:id", reqController.req_delete);


router.get("/home/request", reqController.getReqPage);
// router.post("/home/request",reqController.request_post);


router.post("/home/request", upload.single('image'), reqController.request_post); // Add uploadImage controller method
// router.get("/home/request", reqController.renderUploadForm); // Add renderUploadForm controller method

module.exports = router;
