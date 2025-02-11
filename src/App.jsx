import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState('light')
  const [name, setName] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  if (!user) {
    return (
      <div className={`container ${theme}`}>
        <Auth onLogin={handleLogin} />
      </div>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`container ${theme}`}>
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App
