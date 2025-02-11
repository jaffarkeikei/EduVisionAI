const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Exam = require('../models/Exam')
const { body, validationResult } = require('express-validator')

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.userData.userId })
    res.json(exams)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create exam
router.post('/',
  auth,
  [
    body('title').notEmpty(),
    body('subject').notEmpty(),
    body('date').isDate(),
    body('totalMarks').isNumeric(),
    body('grade').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const exam = new Exam({
        ...req.body,
        createdBy: req.userData.userId
      })

      await exam.save()
      res.status(201).json(exam)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// Update exam
router.put('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userData.userId },
      req.body,
      { new: true }
    )
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }
    res.json(exam)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

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
    res.json({ message: 'Exam deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 