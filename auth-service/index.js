require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 4000;

//Middleware
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🔗 Connected to MongoDB');
}).catch*((err) => {
  console.log('❌ MongoDB connection error:', err);
});


//Routes

// Register user
app.post('/auth/register', async (req,res) => {
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(400).json({message: 'Username and password required'});
  }

  const existingUser = await User.findOne({username});
  if (existingUser){
    return res.status(409).json({message: 'User already exists'});
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({username, password: hashedPassword});
  await newUser.save();

  return res.status(201).json({message:'User registered successfully'});
});

//Login user & return JWT
app.post('/auth/login', async (req,res) => {
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(400).json({message: "Username & password required"});
  }

  const user = await User.findOne({username});
  if (!user){
    return res.status(401).json({message: "Invalid credentials"});
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch){
    return res.status(401).json({message: "Invalid credentials"});
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{
    expiresIn: '1h'
  });
  res.json({token});
});


//Health Check (for Docker healthcheck)
app.get('/health', (req,res) =>{
  res.status(200).json({status:'auth-service healthy'});
});


//Root status
app.get('/', (req, res) => {
  res.json({ message: "Auth Service is running" });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {console.log('Auth Service on http://localhost:${PORT}');
});