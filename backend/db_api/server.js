const express = require('express');
const cors = require('cors');
const {getEmotions} = require('./emotion_echo/emotions.js');
const { login, verifyToken } = require('./auth/auth.js');  

//loading env variables
require('dotenv').config();

const app = express();
const port = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes
app.post('/login', login);  
app.post('/verify-token', verifyToken);  
app.post('/getEmotions', getEmotions);



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
