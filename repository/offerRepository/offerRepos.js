const Offer = require('../../module/offersSchema/offer');

const getOfferById = async id => {
    try {
        const offer = await Offer.findById(id);
        return offer;
    } 
    catch{
        return false;
    }
};

const addOffer = async OfferData => {
    try {
        const newOffer = new Offer(OfferData);
        await newOffer.save();
        return newOffer;
    } 
    catch {
        return false;
    }
};


const udpateOffer = async (id, newData) => {
    try {
        const offer = await Offer.findByIdAndUpdate(id,newData);
        return offer;
    } 
    catch  {
        return false;
    }
};

const deleteOffer = async id => {
    try {
        const offer = await Offer.findOneAndDelete({ requestID, technicalID });
        return true;
    } 
    catch {
        return false;
    }
};

const gettAllOffer = async id => {
    try {
        const offers = await Offer.find();
        return offers;
    } 
    catch {
        return false;
    }
};


const getOffersByTechID = async technicalID => {
    try {
        const latestOffer = await Offer.find({ technicalID })
        return latestOffer ? latestOffer.requestID : null;
    } catch (err) {
        throw err;
    }
};


const deleteOfferbyReqId = async requestID => {
    try {
        const offers = await Offer.deleteMany({ requestID });
        console.log(offers);
        return true;
    } 
    catch {
        return false;
    }
};




module.exports = {
    getOfferById,
    addOffer,
    udpateOffer,
    deleteOffer,
    gettAllOffer,
    getOffersByTechID,
    deleteOfferbyReqId
};