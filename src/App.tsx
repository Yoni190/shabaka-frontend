import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/NotFound/NotFound'
import RegisterPage from './pages/Register/RegisterPage'
import LoginPage from './pages/Login/LoginPage'
import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailsPage from "./pages/Products/ProductDetailsPage";
import RootLayout from './components/layout/RootLayout'
import RequireAuth from './components/auth/RequireAuth'
import AccountLayout from './pages/Account/AccountLayout'
import AccountOverview from './pages/Account/AccountOverview'
import AccountDetails from './pages/Account/AccountDetails'
import AccountAddresses from './pages/Account/AccountAddresses'
import AccountOrders from './pages/Account/AccountOrders'
import AccountSecurity from './pages/Account/AccountSecurity'
import CartPage from './pages/Cart/CartPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderConfirmationPage from './pages/Checkout/OrderConfirmationPage'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AccountOverview />} />
          <Route path="details" element={<AccountDetails />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="security" element={<AccountSecurity />} />
        </Route>

        <Route
          path="/cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
        />

        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout/confirmation"
          element={
            <RequireAuth>
              <OrderConfirmationPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
