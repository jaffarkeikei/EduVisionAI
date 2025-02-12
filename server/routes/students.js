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
    // Name validations
    body('firstName')
      .notEmpty().withMessage('First name is required')
      .isString().withMessage('First name must be text')
      .matches(/^[A-Za-z\s]+$/).withMessage('First name can only contain letters (no numbers or special characters)')
      .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .notEmpty().withMessage('Last name is required')
      .isString().withMessage('Last name must be text')
      .matches(/^[A-Za-z\s]+$/).withMessage('Last name can only contain letters (no numbers or special characters)')
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    
    // Student ID validation
    body('studentId')
      .notEmpty().withMessage('Student ID is required')
      .isNumeric().withMessage('Student ID must contain only numbers (no letters or special characters)')
      .isLength({ min: 4, max: 8 }).withMessage('Student ID must be between 4 and 8 digits'),
    
    // Grade validation
    body('grade')
      .notEmpty().withMessage('Grade is required')
      .isString().withMessage('Grade must be text')
      .matches(/^(Grade\s)?([1-9]|1[0-2])([A-D])?$/i)
      .withMessage('Grade must be between 1-12, optionally followed by A-D (Example: "Grade 10A" or "10")'),
    
    // Date of birth validation
    body('dateOfBirth')
      .optional()
      .isISO8601().withMessage('Invalid date format. Please use YYYY-MM-DD format')
      .custom((value, { req }) => {
        if (!value) return true;
        
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        
        // Extract grade number from grade field
        const gradeMatch = req.body.grade.match(/\d+/);
        if (!gradeMatch) {
          throw new Error('Invalid grade format');
        }
        const gradeNum = parseInt(gradeMatch[0]);
        
        // Calculate minimum age for the grade (grade + 5)
        const minimumAge = gradeNum + 5;
        
        if (age < minimumAge) {
          throw new Error(`Student is too young for grade ${gradeNum}. Minimum age for grade ${gradeNum} should be ${minimumAge} years`);
        }
        
        // Maximum age is typically minimum age + 3
        // const maximumAge = minimumAge + 3;
        // if (age > maximumAge) {
        //   throw new Error(`Student seems too old for grade ${gradeNum}. Maximum age for grade ${gradeNum} should be ${maximumAge} years`);
        // }
        
        return true;
      }),
    
    // Parent email validation
    body('parentEmail')
      .optional()
      .isEmail().withMessage('Please enter a valid parent email address (example: parent@example.com)')
      .normalizeEmail(),
    
    // Parent phone validation
    body('parentPhone')
      .optional()
      .matches(/^\+?[\d\s-]{10,}$/).withMessage('Please enter a valid phone number (minimum 10 digits, can include +, spaces, or dashes)')
  ],
  async (req, res) => {
    try {
      // Validation check
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: errors.array()[0].msg, // Return the first error message
          errors: errors.array().map(err => err.msg)
        })
      }

      // Check for duplicate student ID under current teacher
      const existingStudent = await Student.findOne({ 
        studentId: req.body.studentId,
        createdBy: req.userData.userId 
      })
      
      if (existingStudent) {
        return res.status(400).json({ 
          message: `Student ID ${req.body.studentId} already exists in your class. Please use a different ID.`
        })
      }

      const student = new Student({
        ...req.body,
        createdBy: req.userData.userId
      })
      
      const savedStudent = await student.save()
      res.status(201).json({
        message: `Successfully added ${savedStudent.firstName} ${savedStudent.lastName} to grade ${savedStudent.grade}`,
        student: savedStudent
      })
    } catch (error) {
      console.error('Server error:', error)
      if (error.code === 11000) {
        res.status(400).json({ 
          message: `Student ID ${req.body.studentId} already exists in your class. Please use a different ID.`
        })
      } else {
        res.status(500).json({ 
          message: 'Failed to add student. Please try again.',
          error: error.message
        })
      }
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