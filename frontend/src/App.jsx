import { Route, Routes, Navigate } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
import CategoryPage from "./pages/CategoryPage"
import CartPage from "./pages/CartPage"
import SuccessPage from "./pages/SuccessPage"
import CancelPage from "./pages/CancelPage"
import Navbar from "./components/Navbar"
import UpdateProductForm from "./components/UpdateProductForm"
import { Toaster } from "react-hot-toast"
import { checkAuth } from "./hooks/useUserStore"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  const { data: user } = checkAuth()

  // if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className=" absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={user ? <HomePage /> : <LoginPage />} />
          <Route
            path="/dashboard"
            element={
              user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/updateproduct" element={<UpdateProductForm />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to={"/login"} />}
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
