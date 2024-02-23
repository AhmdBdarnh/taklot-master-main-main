const reqRepository = require('../../repository/requestRepostiory/requesRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');
const req = require('../../module/reuqestsSchema/request');
const multer = require('multer');
const technicalRep = require('../../repository/technicalReoistory/technicalRepos');
const offerRep = require('../../repository/offerRepository/offerRepos');
const {getParameter} = require('../usersController/usersControllers');



// Add middleware for file upload
const upload = multer({ dest: 'uploads/' });


// Controller method for uploading image
const request_post = async (req, res) => {
  try {
    const req_id = req.body.req_id;
    if (req_id) {
      req_delete_byId(req_id);
   }
  const helpseekerId = getParameter('helpseekerID');
    const category = req.body.category;
    const details = req.body.details;
      // Save the image to the database using the repository
      const newReq = await reqRepository.addReq({
        helpseekerId,
          image: {
              filename: req.file.originalname,
              contentType: req.file.mimetype,
              image: req.file.buffer
          },
          category,
          details,
      });
      const tech =  await technicalRep.checkCategory(newReq.category);
      if (tech.isMatch === true){
        const requestID =  newReq._id;
        const technicalID = tech.technical_id;
          const chOffer = await offerRep.addOffer({requestID,technicalID});
          if (!chOffer) throw new BadRequsetError(`Offer implement is not true`);
          
      }
      res.redirect('/home/helpseeker');
    } 
    catch (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    }
};

const renderUploadForm = async (req, res) => {
try {
    // Assuming 'name' is the field by which you want to retrieve the image
    const imageName = req.params.name; // Assuming the name is passed as a parameter

    // Retrieve the latest uploaded image from MongoDB based on the name
    const latestImage = await req.findOne({ filename: imageName }).sort({ _id: -1 });

    // Render the upload form along with the latest image data
    res.render('upload', { latestImage: latestImage });
} catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving image');
}
};



// add new request to db
const getReqPage = async (req, res) => {
  try {
    res.render('requestform');
} 
catch (err) {
  return res.status(err?.status || 500).json({ message: err.message });
}
};





// get all request in db
const getReqByID = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await reqRepository.getReqById(id);
    if (!request || request.length === 0) throw new NotFoundError('Request');
    return res.status(200).send(request);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// update request
const req_update = async (req, res) => {
  try {
    const requestID = req.body.requestID;
    res.render('requestform',{requestID});
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// delete request
const req_delete = async (req, res) => {
  try {
    const requestId = req.body.requestID;

    const deletedReq = await reqRepository.deleteReq(requestId);
    if (!deletedReq || deletedReq.length === 0) throw new NotFoundError('Request');
    const deleteOffer = await offerRep.deleteOfferbyReqId(requestId);
    if (!deleteOffer || deleteOffer.length === 0) throw new NotFoundError('Request in offers');
    res.redirect('/home/helpseeker/requests');
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// delete request by send id
const req_delete_byId = async (reqId) => {
  try {
    const deletedReq = await reqRepository.deleteReq(reqId);
    if (!deletedReq) throw new NotFoundError('Request');
    const deleteOffer = await offerRep.deleteOfferbyReqId(reqId);
    if (!deleteOffer) throw new NotFoundError('Request in offers');
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be caught in the calling function
  }
};


// get all request in db
const getAllReq = async (req, res) => {
  try {
    const req = await reqRepository.gettAllReq();
    if (!req || req.length === 0) throw new NotFoundError('Request');
    return res.status(200).send(req);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};




module.exports = {
request_post,
getReqByID,
req_update,
req_delete,
getAllReq,
getReqPage,

// uploadImage,
renderUploadForm

};