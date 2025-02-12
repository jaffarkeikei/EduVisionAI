import { useState } from 'react'

function StudentForm({ onSubmit, onCancel, editingStudent }) {
  const [studentData, setStudentData] = useState(editingStudent || {
    firstName: '',
    lastName: '',
    studentId: '',
    grade: '',
    dateOfBirth: '',
    gender: '',
    parentEmail: '',
    parentPhone: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Submitting student data:', studentData) // Debug log
      
      const studentToSubmit = {
        ...studentData,
        dateOfBirth: studentData.dateOfBirth || undefined
      }
      
      await onSubmit(studentToSubmit)
      // Form will be closed by the parent component after successful submission
    } catch (error) {
      console.error('Error in StudentForm:', error)
      alert('Failed to save student. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            required
            value={studentData.firstName}
            onChange={(e) => setStudentData({...studentData, firstName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            required
            value={studentData.lastName}
            onChange={(e) => setStudentData({...studentData, lastName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentId">Student ID *</label>
          <input
            id="studentId"
            type="text"
            required
            value={studentData.studentId}
            onChange={(e) => setStudentData({...studentData, studentId: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade/Class *</label>
          <input
            id="grade"
            type="text"
            required
            value={studentData.grade}
            onChange={(e) => setStudentData({...studentData, grade: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            value={studentData.dateOfBirth}
            onChange={(e) => setStudentData({...studentData, dateOfBirth: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={studentData.gender}
            onChange={(e) => setStudentData({...studentData, gender: e.target.value})}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="parentEmail">Parent's Email</label>
          <input
            id="parentEmail"
            type="email"
            value={studentData.parentEmail}
            onChange={(e) => setStudentData({...studentData, parentEmail: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentPhone">Parent's Phone</label>
          <input
            id="parentPhone"
            type="tel"
            value={studentData.parentPhone}
            onChange={(e) => setStudentData({...studentData, parentPhone: e.target.value})}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          {editingStudent ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  )
}

export default StudentForm 