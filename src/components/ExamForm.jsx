import { useState } from 'react'

function ExamForm({ onSubmit, onCancel }) {
  const [examData, setExamData] = useState({
    title: '',
    subject: '',
    date: '',
    totalMarks: '',
    grade: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...examData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, in-progress, completed
    })
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
            placeholder="e.g., Midterm Mathematics"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <select
            id="subject"
            required
            value={examData.subject}
            onChange={(e) => setExamData({...examData, subject: e.target.value})}
          >
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Exam Date *</label>
          <input
            id="date"
            type="date"
            required
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
            min="0"
            value={examData.totalMarks}
            onChange={(e) => setExamData({...examData, totalMarks: e.target.value})}
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
            placeholder="e.g., Grade 10-A"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={examData.description}
            onChange={(e) => setExamData({...examData, description: e.target.value})}
            placeholder="Add any additional details about the exam"
            rows="3"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          Create Exam
        </button>
      </div>
    </form>
  )
}

export default ExamForm 