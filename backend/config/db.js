// Connects to MongoDB Atlas using the MONGO_URI environment variable.
// Exits the process if connection fails — no point running without a DB.

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB Atlas connected: ' + conn.connection.host)
  } catch (err) {
    console.error('MongoDB connection error: ' + err.message)
    process.exit(1)
  }
}

module.exports = connectDB
