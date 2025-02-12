const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers) // Debug log
    
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      console.log('No token found') // Debug log
      return res.status(401).json({ message: 'Authentication failed: No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded) // Debug log
    
    req.userData = decoded
    next()
  } catch (error) {
    console.error('Auth error:', error) // Debug log
    return res.status(401).json({ message: 'Authentication failed' })
  }
} 