const express = require('express');
const paymentRoutes = require('./modules/payment.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Payment Gateway API is running');
});

app.use('/api/payments', paymentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});