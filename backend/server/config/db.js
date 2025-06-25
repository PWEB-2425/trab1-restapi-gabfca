const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://gabrielferncarvalho:ekg1e0AryLkUlokm@studenthubcluster.bmy8i76.mongodb.net/?retryWrites=true&w=majority&appName=StudentHubCluster";
    
    await mongoose.connect(uri, {
      dbName: 'StudentData',
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      }
    });
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;