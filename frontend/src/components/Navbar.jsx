import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { logout } from "../hooks/useUserStore"
import { useQueryClient } from "@tanstack/react-query"
import { useCartStore } from "../stores/cartStore"
import { saveCart } from "../hooks/useCartStore"

const Navbar = () => {
  const { mutate: saveCartMutation } = saveCart()
  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = logout()
  const { zucart: cart, clearStore } = useCartStore()
  const user = queryClient.getQueryData(["user"])
  const isAdmin = user?.role === "admin"

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-50 transition-all duration-300 border-b border-emerald-800 ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to={"/"}
            className="className= text-3xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            Glow MART
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <button onClick={() => saveCartMutation(cart)}>
              <Link
                to={"/"}
                className="block text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
              >
                Home
              </Link>
            </button>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart?.cartItems?.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.cartItems.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/dashboard"}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <div className="gap-0 translate-y-2">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                  onClick={() => {
                    logoutMutation()
                    clearStore()
                  }}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
                <span className="flex items-center justify-center text-[0.5rem] text-emerald-400 animate-pulse">
                  {user && user.name}
                </span>
              </div>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
