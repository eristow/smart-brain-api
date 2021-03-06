const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = async (req, res) => {
  // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
  // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
  // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
  // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
  // so you would change from:
  // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  // to:
  // .predict('d02b4508df58432fbb84e800597b8959', req.body.input)
  try {
    const data = await app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input
    );
    res.json(data);
  } catch (err) {
    res.status(400).json('unable to work with API');
  }
};

const handleImage = async (req, res, db) => {
  const { id, count } = req.body;
  try {
    const entries = await db('users')
      .where('id', '=', id)
      .increment('entries', parseInt(count))
      .returning('entries');
    res.json(entries[0]);
  } catch (err) {
    res.status(400).json('unable to get entries');
  }
};

module.exports = {
  handleImage,
  handleApiCall,
};
