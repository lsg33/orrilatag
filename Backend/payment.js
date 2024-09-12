const express = require('express');
const stripe = require('stripe')('your-secret-key-here');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/charge', async (req, res) => {
const token = req.body.stripeToken;

const charge = await stripe.charges.create({
amount: 2000, // amount in cents
currency: 'usd',
description: 'Example charge',
source: token,
});

res.send('Charge successful');
});

app.listen(3000, () => {
console.log('Server is running on port 3000');
});
