const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Student = require('../models/Student')
const { body, validationResult } = require('express-validator')

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.userData.userId })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create student
router.post('/', 
  auth,
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('studentId').notEmpty(),
    body('grade').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const student = new Student({
        ...req.body,
        createdBy: req.userData.userId
      })

      await student.save()
      res.status(201).json(student)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userData.userId },
      req.body,
      { new: true }
    )
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userData.userId
    })
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json({ message: 'Student deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 