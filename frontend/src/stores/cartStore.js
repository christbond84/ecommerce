import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCoupon: async () => {
    try {
      const res = await axiosInstance.get("/coupons")
      set({ coupon: res.data })
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await axiosInstance.post("/coupons/validate", { code })
      set({ coupon: res.data, isCouponApplied: true })
      get().calculateTotals()
      toast.success("Coupon applied successfully")
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false })
    get().calculateTotals()
    toast.success("Coupon removed successfully")
  },

  getCart: async () => {
    try {
      const res = await axiosInstance.get("/cart")
      set({ cart: res.data.cartItems })
      get().calculateTotals()
    } catch (error) {
      // toast.error(
      //   error.response.data.error ||
      //     error.response.data.message ||
      //     "An error occured"
      // )
    }
  },
  clearCart: async () => {
    await axiosInstance.delete("/cart")
    set({ cart: [], coupon: null, total: 0, subtotal: 0 })
  },

  addToCart: async (product) => {
    try {
      const res = await axiosInstance.post("/cart", { productId: product._id })
      toast.success("Product successfully added", { id: "added" })
      set((prev) => {
        const existingItem = prev.cart.find((item) => item._id === product._id)
        const newCart = existingItem
          ? prev.cart.map((item) =>
              item._id === product._id
                ? { ...product, quantity: item.quantity + 1 }
                : item
            )
          : [...prev.cart, { ...product, quantity: 1 }]
        return { cart: newCart }
      })
      get().calculateTotals()
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`)
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }))
      get().calculateTotals()
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId)
      return
    }
    await axiosInstance.put(`/cart/${productId}`, { quantity })
    set((prev) => ({
      cart: prev.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }))
    get().calculateTotals()
  },

  calculateTotals: () => {
    const { cart, coupon } = get()
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    let total = subtotal
    if (coupon && get().isCouponApplied)
      total = total - (subtotal * coupon.discountPercentage) / 100
    set({ total, subtotal })
  },
}))
