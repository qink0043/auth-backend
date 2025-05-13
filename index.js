const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({
  origin: '*', // 前端地址
  credentials: true
}));
app.use(express.json());

app.use('/api', authRoutes);//

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
