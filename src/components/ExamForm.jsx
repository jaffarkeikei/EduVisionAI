import { useState } from 'react'

function ExamForm({ onSubmit, onCancel, editingExam }) {
  const [examData, setExamData] = useState(editingExam || {
    title: '',
    subject: '',
    date: '',
    totalMarks: '',
    grade: '',
    description: '',
    status: 'pending'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Submitting exam data:', examData) // Debug log
      
      // Format date to ISO string if it exists
      const formattedData = {
        ...examData,
        date: examData.date ? new Date(examData.date).toISOString() : '',
        totalMarks: Number(examData.totalMarks)
      }

      await onSubmit(formattedData)
    } catch (error) {
      console.error('Error in ExamForm:', error)
      alert(error.response?.data?.message || 'Failed to save exam')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="exam-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Exam Title *</label>
          <input
            id="title"
            type="text"
            required
            value={examData.title}
            onChange={(e) => setExamData({...examData, title: e.target.value})}
            placeholder="e.g., Midterm Mathematics Exam"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            type="text"
            required
            value={examData.subject}
            onChange={(e) => setExamData({...examData, subject: e.target.value})}
            placeholder="e.g., Mathematics"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Exam Date *</label>
          <input
            id="date"
            type="date"
            required
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            value={examData.date}
            onChange={(e) => setExamData({...examData, date: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalMarks">Total Marks *</label>
          <input
            id="totalMarks"
            type="number"
            required
            min="1"
            max="1000"
            value={examData.totalMarks}
            onChange={(e) => setExamData({...examData, totalMarks: e.target.value})}
            placeholder="e.g., 100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade/Class *</label>
          <input
            id="grade"
            type="text"
            required
            value={examData.grade}
            onChange={(e) => setExamData({...examData, grade: e.target.value})}
            placeholder="e.g., Grade 10A"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={examData.status}
            onChange={(e) => setExamData({...examData, status: e.target.value})}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={examData.description}
            onChange={(e) => setExamData({...examData, description: e.target.value})}
            placeholder="Add any additional details about the exam"
            rows="3"
            maxLength="500"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          {editingExam ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </form>
  )
}

export default ExamForm 