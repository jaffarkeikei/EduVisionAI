import { useState, useEffect } from 'react'
import StudentForm from './StudentForm'
import StudentList from './StudentList'
import ExamForm from './ExamForm'
import ExamList from './ExamList'
import { students as studentsApi, exams as examsApi } from '../services/api'

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [studentsList, setStudentsList] = useState([])
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [examsList, setExamsList] = useState([])
  const [showExamForm, setShowExamForm] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  
  // Fetch students and exams on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, examsRes] = await Promise.all([
          studentsApi.getAll(),
          examsApi.getAll()
        ])
        setStudentsList(studentsRes.data)
        setExamsList(examsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleAddStudent = async (newStudent) => {
    try {
      const response = await studentsApi.create(newStudent)
      setStudentsList([...studentsList, response.data])
      setShowStudentForm(false)
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setShowStudentForm(true)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsApi.delete(studentId)
        setStudentsList(studentsList.filter(s => s._id !== studentId))
      } catch (error) {
        console.error('Error deleting student:', error)
      }
    }
  }

  const handleAddExam = async (newExam) => {
    try {
      const response = await examsApi.create(newExam)
      setExamsList([...examsList, response.data])
      setShowExamForm(false)
    } catch (error) {
      console.error('Error adding exam:', error)
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setShowExamForm(true)
  }

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examsApi.delete(examId)
        setExamsList(examsList.filter(e => e._id !== examId))
      } catch (error) {
        console.error('Error deleting exam:', error)
      }
    }
  }

  const handleManageScores = (exam) => {
    console.log('Managing scores for:', exam.title)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>welcome, {user.name}</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`tab-button ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            Exams
          </button>
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-stats">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Recent Exams</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Pending Reviews</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="students-section">
            <div className="section-header">
              <h3>Student Management</h3>
              {!showStudentForm && (
                <button 
                  className="primary-button"
                  onClick={() => setShowStudentForm(true)}
                >
                  Add New Student
                </button>
              )}
            </div>

            {showStudentForm ? (
              <StudentForm 
                onSubmit={handleAddStudent}
                onCancel={() => {
                  setShowStudentForm(false)
                  setEditingStudent(null)
                }}
                editingStudent={editingStudent}
              />
            ) : (
              <StudentList 
                students={studentsList}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="exams-section">
            <div className="section-header">
              <h3>Exam Management</h3>
              {!showExamForm && (
                <button 
                  className="primary-button"
                  onClick={() => setShowExamForm(true)}
                >
                  Create New Exam
                </button>
              )}
            </div>

            {showExamForm ? (
              <ExamForm 
                onSubmit={handleAddExam}
                onCancel={() => {
                  setShowExamForm(false)
                  setEditingExam(null)
                }}
                editingExam={editingExam}
              />
            ) : (
              <ExamList 
                exams={examsList}
                onEdit={handleEditExam}
                onDelete={handleDeleteExam}
                onManageScores={handleManageScores}
              />
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h3>Generated Reports</h3>
            <div className="report-filters">
              <select>
                <option value="">Select Class</option>
              </select>
              <select>
                <option value="">Select Subject</option>
              </select>
              <button className="primary-button">Generate Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 