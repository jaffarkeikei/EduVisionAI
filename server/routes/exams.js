const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Exam = require('../models/Exam')
const { body, validationResult } = require('express-validator')

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.userData.userId })
      .sort({ date: -1 }) // Sort by date, newest first
    res.json(exams)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams' })
  }
})

// Create exam
router.post('/',
  auth,
  [
    body('title')
      .notEmpty().withMessage('Exam title is required')
      .isString().withMessage('Title must be text')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
    body('subject')
      .notEmpty().withMessage('Subject is required')
      .isString().withMessage('Subject must be text')
      .matches(/^[A-Za-z\s]+$/).withMessage('Subject can only contain letters'),
    
    body('date')
      .notEmpty().withMessage('Exam date is required')
      .isISO8601().withMessage('Invalid date format')
      .custom((value) => {
        const examDate = new Date(value)
        const today = new Date()
        if (examDate < today) {
          throw new Error('Exam date cannot be in the past')
        }
        return true
      }),
    
    body('totalMarks')
      .notEmpty().withMessage('Total marks is required')
      .isInt({ min: 1, max: 1000 }).withMessage('Total marks must be between 1 and 1000'),
    
    body('grade')
      .notEmpty().withMessage('Grade is required')
      .matches(/^(Grade\s)?([1-9]|1[0-2])([A-D])?$/i)
      .withMessage('Grade must be between 1-12, optionally followed by A-D (Example: "Grade 10A" or "10")'),
    
    body('description')
      .optional()
      .isString().withMessage('Description must be text')
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be either pending, in-progress, or completed')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: errors.array()[0].msg,
          errors: errors.array().map(err => err.msg)
        })
      }

      // Check for duplicate exam on same date for same grade
      const existingExam = await Exam.findOne({
        date: req.body.date,
        grade: req.body.grade,
        createdBy: req.userData.userId
      })

      if (existingExam) {
        return res.status(400).json({
          message: `An exam for grade ${req.body.grade} is already scheduled on ${new Date(req.body.date).toLocaleDateString()}`
        })
      }

      const exam = new Exam({
        ...req.body,
        createdBy: req.userData.userId,
        status: req.body.status || 'pending'
      })

      const savedExam = await exam.save()
      res.status(201).json({
        message: `Successfully scheduled ${savedExam.title} for ${new Date(savedExam.date).toLocaleDateString()}`,
        exam: savedExam
      })
    } catch (error) {
      console.error('Server error:', error)
      res.status(500).json({ 
        message: 'Failed to create exam. Please try again.',
        error: error.message 
      })
    }
  }
)

// Update exam
router.put('/:id', 
  auth,
  [
    // Same validation as POST route
  ],
  async (req, res) => {
    try {
      const exam = await Exam.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.userData.userId },
        req.body,
        { new: true }
      )
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' })
      }
      res.json({
        message: 'Exam updated successfully',
        exam
      })
    } catch (error) {
      res.status(500).json({ message: 'Failed to update exam' })
    }
  }
)

// Delete exam
router.delete('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userData.userId
    })
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }
    res.json({ 
      message: `Successfully deleted ${exam.title}`,
      examId: exam._id 
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam' })
  }
})

module.exports = router 