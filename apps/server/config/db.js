const mongoose = require('mongoose');

const password = encodeURIComponent(process.env.DB_PASSWORD);
const uri = `mongodb+srv://${process.env.DB_USER}:${password}@cluster0.u5ore9c.mongodb.net/?appName="Cluster0"`;


const connectDB = async () => {
  try {
    await mongoose.connect(uri, {serverApi:{version:'1',strict:true,deprecationErrors:true}});
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;