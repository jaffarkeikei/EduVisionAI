import { useState } from 'react'

function StudentList({ students, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'studentId',
    direction: 'ascending'
  })

  // Sorting function
  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig.key === 'name') {
      const firstNameA = a.firstName.toLowerCase();
      const firstNameB = b.firstName.toLowerCase();
      
      if (firstNameA < firstNameB) return -1;
      if (firstNameA > firstNameB) return 1;
      return 0;
    } else if (sortConfig.key === 'studentId') {
      const idA = parseInt(a.studentId);
      const idB = parseInt(b.studentId);
      
      if (idA < idB) return -1;
      if (idA > idB) return 1;
      return 0;
    } else if (sortConfig.key === 'dateOfBirth') {
      // Convert dates to timestamps for comparison
      const dateA = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0;
      const dateB = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0;
      
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    } else if (sortConfig.key === 'gender') {
      // Custom order: female, male, other, not specified
      const genderOrder = { 
        'female': 1, 
        'male': 2, 
        'other': 3, 
        'not-specified': 4 
      };
      const genderA = genderOrder[a.gender || 'not-specified'];
      const genderB = genderOrder[b.gender || 'not-specified'];
      
      if (genderA < genderB) return -1;
      if (genderA > genderB) return 1;
      return 0;
    }
    
    // Default string comparison for other fields
    const valueA = (a[sortConfig.key] || '').toString().toLowerCase();
    const valueB = (b[sortConfig.key] || '').toString().toLowerCase();
    
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });

  // If descending is requested, reverse the array after sorting
  if (sortConfig.direction === 'descending') {
    sortedStudents.reverse();
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
    }
    return ''
  }

  return (
    <div className="student-list-container">
      <div className="student-list">
        <table>
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('studentId')}
                className={sortConfig.key === 'studentId' ? `sort-${sortConfig.direction}` : ''}
              >
                Student ID{getSortIndicator('studentId')}
              </th>
              <th 
                onClick={() => requestSort('name')}
                className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}
              >
                Name{getSortIndicator('name')}
              </th>
              <th 
                onClick={() => requestSort('grade')}
                className={sortConfig.key === 'grade' ? `sort-${sortConfig.direction}` : ''}
              >
                Grade{getSortIndicator('grade')}
              </th>
              <th 
                onClick={() => requestSort('gender')}
                className={sortConfig.key === 'gender' ? `sort-${sortConfig.direction}` : ''}
              >
                Gender{getSortIndicator('gender')}
              </th>
              <th 
                onClick={() => requestSort('dateOfBirth')}
                className={sortConfig.key === 'dateOfBirth' ? `sort-${sortConfig.direction}` : ''}
              >
                Date of Birth{getSortIndicator('dateOfBirth')}
              </th>
              <th 
                onClick={() => requestSort('parentEmail')}
                className={sortConfig.key === 'parentEmail' ? `sort-${sortConfig.direction}` : ''}
              >
                Parent Email{getSortIndicator('parentEmail')}
              </th>
              <th 
                onClick={() => requestSort('parentPhone')}
                className={sortConfig.key === 'parentPhone' ? `sort-${sortConfig.direction}` : ''}
              >
                Parent Phone{getSortIndicator('parentPhone')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.grade}</td>
                <td>
                  <span className={`gender-badge ${student.gender || 'not-specified'}`}>
                    {student.gender ? 
                      student.gender.charAt(0).toUpperCase() + student.gender.slice(1) 
                      : 'Not Specified'}
                  </span>
                </td>
                <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td className="email-cell">
                  {student.parentEmail || '-'}
                </td>
                <td>{student.parentPhone || '-'}</td>
                <td className="actions-cell">
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
    </div>
  )
}

export default StudentList 