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
    refetchOnMount: false,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product) => {
      const res = await axiosInstance.post("/cart", { productId: product._id })
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

export const removeFromCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId) => {
      await axiosInstance.delete(`/cart/${productId}`)
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

export const updateQuantity = () => {
  const { mutate: removeFromCartMutation } = removeFromCart()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables) => {
      const { productId, quantity } = variables
      if (quantity === 0) {
        removeFromCartMutation(productId)
        return
      }
      await axiosInstance.put(`/cart/${productId}`, { quantity })
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

export const saveCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (cart) => {
      await axiosInstance.post(`/cart/saveCart`, { cart })
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

export const resetCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/cart/resetCart`)
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
    refetchOnMount: false,
  })
}

export const applyCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (code) => {
      const res = await axiosInstance.post("/coupons/validate", { code })
      toast.success("Coupon applied successfully")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] })
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/coupons/activate")
      toast.success("Coupon removed successfully")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] })
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
