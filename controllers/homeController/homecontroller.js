// const userRepository = require('../../repository/userRepository/userRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');



const getHomePage = async (req, res) => {
    try {
        // const userId = req.session.userId || null;
        const latestImage = null;
<<<<<<< HEAD
        res.render('home', { latestImage }); // Pass userId to the view template
=======
        res.render('index', { latestImage }); // Pass userId to the view template
>>>>>>> ebraheem
      } catch (err) {
        return res.status(err?.status || 500).json({ message: err.message });
      }
  };
  
  // get get page
  const post_HomePage = async (req, res) => {
    try {
<<<<<<< HEAD
      res.status(200).render('home', { userId: res.userId });
=======
      res.status(200).render('index', { userId: res.userId });
>>>>>>> ebraheem
    } 
    catch (err) {
      return res.status(err?.status || 500).json({ message: err.message });
    }
  };


module.exports = {
    getHomePage,
    post_HomePage
}
