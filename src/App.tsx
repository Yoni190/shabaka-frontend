import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/NotFound/NotFound'
import RegisterPage from './pages/Register/RegisterPage'
import LoginPage from './pages/Login/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
