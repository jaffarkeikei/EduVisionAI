function StudentList({ students, onEdit, onDelete }) {
  return (
    <div className="student-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Parent Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.grade}</td>
              <td>
                {student.parentEmail && (
                  <div>{student.parentEmail}</div>
                )}
                {student.parentPhone && (
                  <div>{student.parentPhone}</div>
                )}
              </td>
              <td>
                <button 
                  className="icon-button"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </button>
                <button 
                  className="icon-button delete"
                  onClick={() => onDelete(student._id)}
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

export default StudentList 