import { create } from "zustand"
import toast from "react-hot-toast"

export const useCartStore = create((set, get) => ({
  zucart: [],
  zucoupon: null,

  setCoupon: (couponData) => {
    try {
      set(() => ({ zucoupon: couponData }))
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  applyCoupon: () => {
    try {
      const { zucoupon } = get()
      if (zucoupon) {
        set((prev) => ({
          zucoupon: {
            ...prev.zucoupon,
            isActive: false,
          },
        }))
        get().calculateTotals()
      } else {
        toast.error("Coupon not found")
      }
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  removeCoupon: () => {
    set((prev) => ({
      zucoupon: {
        ...prev.zucoupon,
        isActive: true,
      },
    }))
    get().calculateTotals()
    // toast.success("Coupon removed successfully")
  },

  setCart: (cartData) => {
    try {
      set(() => ({ zucart: cartData }))
      get().calculateTotals()
    } catch (error) {
      console.log(error)
      // toast.error(
      //   error.response.data.error ||
      //     error.response.data.message ||
      //     "An error occured"
      // )
    }
  },
  clearCart: () => {
    set(() => ({ zucart: [] }))
  },

  clearStore: () => {
    set(() => ({ zucart: [] }))
    set(() => ({ zucoupon: null }))
  },

  addToCart: (product) => {
    try {
      set((prev) => {
        const existingItem = prev.zucart.cartItems.find(
          (item) => item._id === product._id
        )
        const newCart = existingItem
          ? prev.zucart.cartItems.map((item) =>
              item._id === product._id
                ? { ...product, quantity: item.quantity + 1 }
                : item
            )
          : [...prev.zucart.cartItems, { ...product, quantity: 1 }]

        return { zucart: { ...prev.zucart, cartItems: newCart } }
      })
      // toast.success("Product successfully added", { id: "added" })
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
      set((prev) => ({
        zucart: {
          ...prev.zucart,
          cartItems: prev.zucart.cartItems.filter(
            (item) => item._id !== productId
          ),
        },
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
    } else {
      set((prev) => ({
        zucart: {
          ...prev.zucart,
          cartItems: prev.zucart.cartItems.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        },
      }))
    }
    get().calculateTotals()
  },

  calculateTotals: () => {
    const { zucart, zucoupon } = get()
    const subtotal = zucart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    let total = subtotal
    if (zucoupon && !zucoupon.isActive)
      total = total - (subtotal * zucoupon.discountPercentage) / 100
    set((prev) => ({
      zucart: {
        ...prev.zucart,
        cartTotals: { subtotal, total },
      },
    }))
  },
}))
