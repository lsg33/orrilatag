const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');
const mongoose = require('mongoose');
const PlayFabSDK = require('playfab-sdk');

const app = express();
const port = 3000;

const CLIENT_ID = '7238920182799088';
const CLIENT_SECRET = '8e3cd98c2f0cd62dd2af8dc57fb229ac';
const REDIRECT_URI = 'https://fa2d614f-5877-4065-840c-7f14e9a25bd7-00-329xi1uavji0x.spock.replit.dev/index.html/?code=';

// MongoDB connection
const mongoURI = 'mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/NT';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  name: String,
  email: String,
  playfab_id: String // Add playfab_id field to store PlayFab ID
});

const User = mongoose.model('User', UserSchema, 'Users');

// Initialize PlayFab SDK with your titleId
PlayFabSDK.settings.titleId = 'YOUR_PLAYFAB_TITLE_ID';
PlayFabSDK.settings.developerSecretKey = 'YOUR_PLAYFAB_SECRET_KEY';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle OAuth callback directly on /index.html
app.get('/api/meta/login', async (req, res) => {
  const { code } = req.query;

  try {
    if (!code) {
      throw new Error('Authorization code not found');
    }

    // Exchange code for Oculus access token
    const tokenResponse = await axios.post(
      'https://graph.oculus.com/oauth/access_token',
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user data from Oculus
    const userResponse = await axios.get(
      `https://graph.oculus.com/me?access_token=${access_token}&fields=id,name,email`
    );

    const userData = userResponse.data;

    // Authenticate with PlayFab using Oculus access token
    const playFabIdResponse = await PlayFabSDK.AuthenticateSessionTicket({
      SessionTicket: access_token
    });

    const playFabId = playFabIdResponse.data.UserInfo.PlayFabId;
    const username = playFabIdResponse.data.UserInfo.Username;

    // Save user data to MongoDB including PlayFab ID
    const newUser = new User({
      id: userData.id,
      username: username,
      name: userData.name,
      email: userData.email,
      playfab_id: playFabId
    });
    await newUser.save();

    // Redirect to /index.html or respond with success
    res.redirect('/index.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
