function ExamList({ exams, onEdit, onDelete, onManageScores }) {
  return (
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam.id}>
              <td>{exam.title}</td>
              <td>{exam.subject}</td>
              <td>{new Date(exam.date).toLocaleDateString()}</td>
              <td>{exam.grade}</td>
              <td>{exam.totalMarks}</td>
              <td>
                <span className={`status-badge ${exam.status}`}>
                  {exam.status}
                </span>
              </td>
              <td className="action-buttons">
                <button 
                  className="icon-button primary"
                  onClick={() => onManageScores(exam)}
                >
                  Manage Scores
                </button>
                <button 
                  className="icon-button"
                  onClick={() => onEdit(exam)}
                >
                  Edit
                </button>
                <button 
                  className="icon-button delete"
                  onClick={() => onDelete(exam.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExamList 