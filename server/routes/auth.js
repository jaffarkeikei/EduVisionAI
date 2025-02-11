const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')

// Register route with improved validation and error handling
router.post('/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
  ],
  async (req, res) => {
    try {
      // Log the incoming request body (remove in production)
      console.log('Register request:', {
        email: req.body.email,
        name: req.body.name,
        // Don't log password
      })

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array())
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: errors.array() 
        })
      }

      const { email, password, name } = req.body
      
      // Check if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ 
          message: 'User already exists with this email' 
        })
      }

      // Create new user
      user = new User({
        email,
        password, // Will be hashed by the pre-save middleware
        name
      })

      await user.save()
      console.log('User created successfully:', email)

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.status(201).json({
        message: 'User created successfully',
        token,
        userId: user._id,
        email: user.email,
        name: user.name
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ 
        message: 'Error creating user',
        error: error.message 
      })
    }
  }
)

// Login route with improved error handling
router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Log the incoming request (remove in production)
      console.log('Login attempt for:', req.body.email)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array())
        return res.status(400).json({ 
          message: 'Invalid input data',
          errors: errors.array() 
        })
      }

      const { email, password } = req.body
      
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        })
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      console.log('Login successful for:', email)
      res.json({
        message: 'Login successful',
        token,
        userId: user._id,
        email: user.email,
        name: user.name
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ 
        message: 'Server error during login',
        error: error.message 
      })
    }
  }
)

module.exports = router 