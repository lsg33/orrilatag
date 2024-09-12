const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/NT?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a User schema and model
const UserSchema = new mongoose.Schema({
  id: { type: String, required: false, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  tags: { type: String, required: false },
  playtime: { type: String, required: false },
  // Add other fields as needed
});

const User = mongoose.model('User', UserSchema, 'Users');

// Serve user.html as the main entry point
app.get('/Static/user.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'user.html'));
});

// API endpoint to fetch user data based on username query parameter
app.get('/api/user', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error while server was fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
