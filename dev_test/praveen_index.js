const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// Import the authentication routes

const bookRoutes = require('../routes/bookRoutes');

// Use the routes

app.use('/api',bookRoutes);