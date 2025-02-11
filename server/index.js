require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const studentRoutes = require('./routes/students')
const examRoutes = require('./routes/exams')

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// More detailed MongoDB connection
console.log('Attempting to connect to MongoDB...')
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB')
})
.catch((error) => {
  console.error('MongoDB connection error details:', {
    name: error.name,
    message: error.message,
    code: error.code,
    codeName: error.codeName
  })
  process.exit(1)
})

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/exams', examRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`)
    app.listen(PORT + 1)
  } else {
    console.error('Server error:', err)
  }
}) 