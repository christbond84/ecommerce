import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const getCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cart")
      return response.data
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export const clearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/cart")

      const cartTotals = { subtotal: 0, total: 0 }
      await axiosInstance.post("/cart/updateTotal", { cartTotals })
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart"], {
        cartItems: [],
        cartTotals: { subtotal: 0, total: 0 },
      })
      queryClient.setQueryData(["coupon"], {})
      toast.success("Cart cleared successfully")
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const addToCart = () => {
  const { mutate: calculateMutation } = calculateTotals()

  return useMutation({
    mutationFn: async (product) => {
      const res = await axiosInstance.post("/cart", { productId: product._id })
    },
    onSuccess: () => {
      calculateMutation()
      toast.success("Product successfully added", { id: "added" })
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const removeFromCart = () => {
  const { mutate: calculateMutation } = calculateTotals()

  return useMutation({
    mutationFn: async (productId) => {
      await axiosInstance.delete(`/cart/${productId}`)
    },
    onSuccess: () => {
      calculateMutation()
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const updateQuantity = () => {
  const { mutate: calculateMutation } = calculateTotals()
  const { mutate: removeFromCartMutation } = removeFromCart()

  return useMutation({
    mutationFn: async (productId, quantity) => {
      if (quantity === 0) {
        removeFromCartMutation(productId)
        return
      }
      await axiosInstance.put(`/cart/${productId}`, { quantity })
    },
    onSuccess: () => {
      calculateMutation()
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const getCoupon = () => {
  return useQuery({
    queryKey: ["coupon"],
    queryFn: async () => {
      const response = await axiosInstance.get("/coupons")
      return response.data
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export const applyCoupon = () => {
  const { mutate: calculateMutation } = calculateTotals()

  return useMutation({
    mutationFn: async (code) => {
      const res = await axiosInstance.post("/coupons/validate", { code })
      toast.success("Coupon applied successfully")
    },
    onSuccess: () => {
      const { isSuccess } = getCoupon()
      isSuccess && calculateMutation()
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const removeCoupon = () => {
  const { mutate: calculateMutation } = calculateTotals()

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/coupons/activate")
      toast.success("Coupon removed successfully")
    },
    onSuccess: () => {
      const { isSuccess } = getCoupon()
      isSuccess && calculateMutation()
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

const calculateTotals = () => {
  const queryClient = useQueryClient()
  const { data: cart, isSuccessCart } = getCart()
  const { data: coupon, isSuccessCoupon } = getCoupon()
  return useMutation({
    mutationFn: async () => {
      if (isSuccessCart && isSuccessCoupon) {
        const subtotal = cart.cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )

        let total = subtotal
        if (coupon && !coupon.isActive)
          total = total - (subtotal * coupon.discountPercentage) / 100

        const cartTotals = { subtotal, total }

        await axiosInstance.post("/cart/updateTotal", { cartTotals })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}
