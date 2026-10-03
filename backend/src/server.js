const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const propertiesRoutes = require('./routes/propertiesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de inmobiliaria funcionando' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});