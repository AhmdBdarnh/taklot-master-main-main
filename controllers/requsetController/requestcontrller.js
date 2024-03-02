const reqRepository = require("../../repository/requestRepostiory/requesRepos");
const techReqRepo = require("../../repository/techRequestRepo/techRequestRepos");
const offerRep = require("../../repository/offerRepository/offerRepos");
const Techincal = require("../../module/technicalDataSchema/techincal");
// const TechnicianSocketMapping = require("../../module/tehnicalMappingSocketSchema/techMapSchema");
const Notification = require("../../module/notificationSchema/notificationSchema ")
const { NotFoundError, BadRequsetError } = require("../../errors/err");
const { getParameter } = require("../usersController/usersControllers");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilio = require("twilio");
const FormData = require("form-data");
const fs = require("fs");
const { getUserSocketId,
  getOnlineUsers,
  io} = require('../../socket/index');

// console.log('Current User Socket Map:', userSocketMap);

// Function to send SMS
async function sendSMS(to, body) {
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const message = await client.messages.create({
      body: body,
      to: to, // Text this number
      from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
    });
    console.log(`SMS sent! ID: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS:`, error);
  }
}

async function sendNotification(technicianId, content) {
  const onlineUsers = getOnlineUsers();
  console.log(onlineUsers);

  const socketId = getUserSocketId(technicianId);
  console.log('Sending notification to technicianId:', technicianId, 'Socket ID:', socketId);
  if (socketId) {
    io.to(socketId).emit('notification', content);
    console.log('Notification sent:', content);
  } else {
    console.log('Technician is offline:', technicianId);
    // Consider storing the notification for later delivery
  }
}


async function notifyRelevantTechnicals(matchingTechnicals, newRequest) {
  for (const technical of matchingTechnicals) {
    const emailContent = {
      to: technical.email,
      from: "aminw999mn@gmail.com",
      subject: `New Request Available in ${newRequest.category}`,
      text: `Hello ${technical.fullName},\n\nA new request in your category "${newRequest.category}" has been opened. Details: ${newRequest.details}`,
      html: `<p>Hello <b>${technical.fullName}</b>,</p><p>A new request in your category "<b>${newRequest.category}</b>" has been opened. Details: ${newRequest.details}</p>`,
    };

    const notificationContent = {
      title: `New Request in ${newRequest.category}`,
      message: `A new request in your category "${newRequest.category}" has been opened. Details: ${newRequest.details}`,
      requestId: newRequest._id.toString(),
      category: newRequest.category,
      details: newRequest.details,
    };

    try {
      // Send email
      await sgMail.send(emailContent);
      console.log(`Email sent to ${technical.fullName}`);


      const notificationContent = `A new request in your category "${newRequest.category}" has been opened. Details: ${newRequest.details}`;
      await sendNotification(technical._id.toString(), notificationContent);
      console.log(`Notification processed for ${technical.fullName}`);
    } 
    
    catch (error) {
      console.error(`Failed to process notification for ${technical.fullName}:`, error);
    }
  }
}


// Controller method for uploading image
const request_post = async (req, res) => {
  try {
    // for the update button
    const { req_id, category, details, image } = req.body;
    let data;
    if (!category) {
      data = { details, image };
    }
    else {
      data = { category, details, image };
    }
    if (req_id) {
      const updatedRequset = await reqRepository.updateReqq(req_id, data);
    } else {
      if (req.file && req.file.path) {
        const formData = new FormData();
        formData.append("image", fs.createReadStream(req.file.path));
        // Proceed with sending the file to the Flask app
      } else {
        // Handle the case where the file is not uploaded
        console.log("No file uploaded.");
        // You might want to return an error response here
      }
      const helpseekerId = getParameter("helpseekerID");

      // const { category, details } = req.body;
      const matchingTechnicals = await Techincal.find({
        category: category,
      });
      if (matchingTechnicals && matchingTechnicals.length > 0) {
        // Save the image to the database using the repository
        const newReq = await reqRepository.addReq({
          helpseekerId,
          image: {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            image: req.file.buffer,
          },
          category,
          details,
        });
        await notifyRelevantTechnicals(matchingTechnicals, newReq);
        const requestID = newReq._id;
        for (const technical of matchingTechnicals) {
          const technicalID = technical._id;
          const chReq = await techReqRepo.addRequest({
            requestID,
            technicalID,
          });
          if (!chReq)
            throw new BadRequsetError(`something is not true in add request`);
        }
      } else {
        console.log("No matching technicals found for category:", category);
      }
    }

    res.redirect("/home/helpseeker");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading image");
  }
};

const renderUploadForm = async (req, res) => {
  try {
    // Assuming 'name' is the field by which you want to retrieve the image
    const imageName = req.params.name; // Assuming the name is passed as a parameter

    // Retrieve the latest uploaded image from MongoDB based on the name
    const latestImage = await req
      .findOne({ filename: imageName })
      .sort({ _id: -1 });

    // Render the upload form along with the latest image data
    res.render("upload", { latestImage: latestImage });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving image");
  }
};

// add new request to db
const getReqPage = async (req, res) => {
  try {
    res.render("requestform");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all request in db
const getReqByID = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await reqRepository.getReqById(id);
    if (!request || request.length === 0) throw new NotFoundError("Request");
    return res.status(200).send(request);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// update request
const req_update = async (req, res) => {
  try {
    const requestID = req.body.requestID;
    res.render("requestform", { requestID });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// delete request
const req_delete = async (req, res) => {
  try {
    const requestId = req.body.requestID;
    const deletedReq = await reqRepository.deleteReq(requestId);
    if (!deletedReq || deletedReq.length === 0)
      throw new NotFoundError("Request");

    const techReq = await techReqRepo.deleteRequestsByRequestId(requestId);
    if (!techReq || techReq.length === 0) throw new NotFoundError("Request");

    const deleteOffer = await offerRep.deleteOfferbyReqId(requestId);
    if (!deleteOffer || deleteOffer.length === 0)
      throw new NotFoundError("Request in offers");

    res.redirect("/home/helpseeker/requests");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all request in db
const getAllReq = async (req, res) => {
  try {
    const req = await reqRepository.gettAllReq();
    if (!req || req.length === 0) throw new NotFoundError("Request");
    return res.status(200).send(req);
  } catch (err) {
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
  renderUploadForm,
};
