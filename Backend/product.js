const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/products';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a User schema and model
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  price: { type: String, required: false },
  description: { type: String, required: false },
  debug: { type: String, required: false },
  // Add other fields as needed
});
const Product = mongoose.model('product', productSchema);

// Serve user.html as the main entry point
app.get('/item.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'item.html'));
});

// API endpoint to fetch user data based on username query parameter
app.get('/api/product', async (req, res) => {
  try {
    const product = req.query.productP;
    if (!product) {
      return res.status(400).json({ error: 'products parameter is required' });
    }
    const productS = await Product.findOne({ productName });
    if (!productS) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
