function ExamList({ exams, onEdit, onDelete, onManageScores }) {
  return (
    <div className="exam-list-container">
      <div className="exam-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Grade</th>
              <th>Total Marks</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam._id}>
                <td>{exam.title}</td>
                <td>{exam.subject}</td>
                <td>{new Date(exam.date).toLocaleDateString()}</td>
                <td>{exam.grade}</td>
                <td>{exam.totalMarks}</td>
                <td>
                  <span className={`status-badge ${exam.status}`}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </span>
                </td>
                <td className="description-cell">
                  <div className="description-content">
                    {exam.description || 'No description provided'}
                  </div>
                </td>
                <td className="actions-cell">
                  <button 
                    className="icon-button primary"
                    onClick={() => onManageScores(exam)}
                  >
                    Scores
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => onEdit(exam)}
                  >
                    Edit
                  </button>
                  <button 
                    className="icon-button delete"
                    onClick={() => onDelete(exam._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExamList 