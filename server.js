const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 3001; // or any other port number

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/user_master', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with a failure
  }
};

// Define User schema and model
const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  gender: String,
  status: String,
  created_at: Date,
  updated_at: Date,
});

const User = mongoose.model('User', userSchema);

// Fetch API data and store in database
const fetchUsersFromAPI = async () => {
  try {
    const API_TOKEN = '215a7351bdada9aecbcba4a82bfb12a13ece3c29c06cffa33feed1d5673da763';

    const response = await axios.get('https://gorest.co.in/public-api/users', {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const users = response.data.data;
    console.log(users);

    // Save users to the database
    await User.insertMany(users);

    console.log('Data fetched and stored successfully.');
  } catch (error) {
    console.error(error);
  }
};

// Fetch user data from the database
const fetchUsersFromDB = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Update user data in the database
// Update user data in the database
// Update user data in the database
const updateUserInDB = async (id, updatedData) => {
    try {
      const user = await User.findOneAndUpdate({ id: id }, { $set: updatedData }, {
        new: true,
      });
      console.log('User updated:', user);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  

// Connect to MongoDB
connectDB();

// Fetch users from API and store in the database
fetchUsersFromAPI();

// Fetch users from the database and return as JSON
app.get('/api/users', async (req, res) => {
  const users = await fetchUsersFromDB();
  res.json(users);
});

// Update user data in the database
// Update user data in the database
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, gender, status } = req.body;
  
    const updatedUser = await updateUserInDB(id, { name, email, gender, status });
  
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
