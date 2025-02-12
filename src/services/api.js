import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response
    } catch (error) {
      console.error('Login error:', error.response?.data || error)
      throw error
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      console.error('Register error:', error.response?.data || error)
      throw error
    }
  }
}

export const students = {
  getAll: () => api.get('/students'),
  create: async (studentData) => {
    console.log('Sending student data to server:', studentData) // Debug log
    try {
      const response = await api.post('/students', studentData)
      console.log('Server response:', response) // Debug log
      return response
    } catch (error) {
      console.error('API error:', error.response || error)
      throw error
    }
  },
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  delete: (id) => api.delete(`/students/${id}`)
}

export const exams = {
  getAll: () => api.get('/exams'),
  create: (examData) => api.post('/exams', examData),
  update: (id, examData) => api.put(`/exams/${id}`, examData),
  delete: (id) => api.delete(`/exams/${id}`)
}

export default api 