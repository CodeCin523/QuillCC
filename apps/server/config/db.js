const mongoose = require('mongoose');

// Environment variables for Atlas or fallback to local
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD || '');
const DB_HOST = process.env.DB_HOST || 'localhost:27017';
const DB_NAME = process.env.DB_NAME || 'mydatabase';

// Choose connection string
const uri = DB_USER && DB_PASSWORD
  ? `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?appName="Cluster0"`
  : `mongodb://${DB_HOST}/${DB_NAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    console.log(`MongoDB connected to ${DB_USER ? 'Atlas' : 'local'} database`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;