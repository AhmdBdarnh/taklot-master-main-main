const techRepository = require('../../repository/technicalReoistory/technicalRepos');
const offerRepository = require('../../repository/offerRepository/offerRepos');
const requestRepository = require('../../repository/requestRepostiory/requesRepos');
const userRepository = require('../../repository/userRepository/userRepos');

const {saveParameter,getParameter} = require('../usersController/usersControllers');
const { NotFoundError, BadRequsetError } = require('../../errors/err');


const deleteOffer = async (req, res) => {
  try {
    const { requestID, technicalID } = req.body;
    await offerRepository.deleteOffer({ requestID, technicalID });
  } catch (error) {
    throw error;
  }
};


// get signup page
const getSignup = async (req, res) => {
  try {
      res.render('techSingup');
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get Technical page
const getTechPage = async (req, res) => {
  try {
    // const technicalID = getParameter('technicalId');
    // const request = await getOffers(technicalID);
    // const helpseekersId = await 
    // const userData = await userRepository.getName_Number(helpseekerId);
    res.render('index');
  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};


const getOffers = async (technicalID) => {
  try {

    const offers = await offerRepository.getOffersByTechID(technicalID);
    console.log(offers);
    // const request = await requestRepository.getReqById(offer);
  

    // const requestIDs = offers.map(offer => offer.requestID.toString());
    return offers;
  } catch (err) {
    throw err;
  }
};






// add new Technical to db
const techincal_post = async (req, res) => {
  try {
    const new_Tech = await techRepository.addTechincal(req.body);
    if (!new_Tech) throw new BadRequsetError(`Technical implement is not true`);
    res.redirect('/login');

  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all Technical in db
const getTechincalByID = async (req, res) => {
  try {
    const { id } = req.params;
    const tech = await techRepository.getTechincalById(id);
    if (!tech || tech.length === 0) throw new NotFoundError('Technical');
    return res.status(200).send(tech);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// update Technical
const techincal_update = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTec = await techRepository.udpateTechincal(id, req.body);
    if (!updatedTec || updatedTec.length === 0) throw new NotFoundError('Technical');
    return res.status(200).send(updatedTec);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// delete Technical
const techincal_delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTech = await techRepository.deleteTechincal(id);
    if (!deletedTech || deletedTech.length === 0) throw new NotFoundError('Technical');
    return res.status(200).send(deletedTech);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get all Technical in db
const getAllTechincal = async (req, res) => {
  try {
    const Tech = await techRepository.getAllTechincal();
    if (!Tech || Tech.length === 0) throw new NotFoundError('Technical');
    return res.status(200).send(Tech);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};




module.exports = {
    techincal_post,
    getTechincalByID,
    techincal_update,
    techincal_delete,
    getAllTechincal,
    getTechPage,
    getOffers,
    deleteOffer,
    getSignup
};