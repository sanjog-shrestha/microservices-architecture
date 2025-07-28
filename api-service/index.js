const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
app.use(express.json());

// Health check route (for Docker healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'api-service healthy' });
});

//Base test route
app.get('/', (req, res) => {
  res.json({ message: "Api Service is running" });
});

//Public route (no token required)
app.get('/api/public',(req,res) =>{
  res.json({message: "This is a public endpoint"});
});

//JWT verification middleware
function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({error:"No token provided"});
  
  console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({error: "Invalid or expired token"});
    req.user = user;
    next();
  });
}

// Protect route (requres valid JWT)
app.get('/api/protected',authenticateToken,(req,res) => {
  res.json({
    message: "Access granted to protected data",
    userId: req.user.userId
  });
});

//Start server
app.listen(5000, '0.0.0.0', () => console.log('Api Service on port 5000'));
