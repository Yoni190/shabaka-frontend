import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/NotFound/NotFound'
import RegisterPage from './pages/Register/RegisterPage'
import LoginPage from './pages/Login/LoginPage'
import ProductsPage from "./pages/Products/ProductsPage";
import RootLayout from './components/layout/RootLayout'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
