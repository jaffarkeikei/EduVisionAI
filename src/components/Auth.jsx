import { useState } from 'react'
import { auth } from '../services/api'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields')
      }

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }
      }

      const response = isLogin
        ? await auth.login({
            email: formData.email,
            password: formData.password
          })
        : await auth.register({
            email: formData.email,
            password: formData.password,
            name: formData.name || formData.email.split('@')[0]
          })

      console.log('Auth response:', response.data)

      const { token, userId, name } = response.data
      localStorage.setItem('token', token)
      onLogin({ email: formData.email, id: userId, name })
    } catch (error) {
      console.error('Auth error:', error)
      setError(
        error.response?.data?.message || 
        error.message || 
        'Authentication failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={loading}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          disabled={loading}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            disabled={loading}
          />
        )}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <p className="auth-switch">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          className="link-button"
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              name: ''
            })
          }}
          disabled={loading}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  )
}

export default Auth 