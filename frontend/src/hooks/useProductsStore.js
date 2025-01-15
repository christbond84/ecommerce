import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import axios from "../lib/axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export const fetchAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/products")
      return response.data.products
    },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  })
}

export const fetchProductsByCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category) => {
      const response = await axios.get(`/products/category/${category}`)

      queryClient.setQueryData(["products"], response.data.products)
    },
    // onSuccess: () => {
    //   toast.success("Products fetched by category")
    // },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const fetchFeaturedProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await axios.get("/products/featured")

      queryClient.setQueryData(["products"], response.data.featuredProducts)
    },
    // onSuccess: () => {
    //   toast.success("Featured products fetched")
    // },
    onError: () => {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    },
  })
}

export const createProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData) => {
      const response = await axiosInstance.post("/products", productData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created successfully")
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

export const updateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData) => {
      const response = await axiosInstance.patch("/products", productData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated successfully")
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

export const deleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      const response = await axiosInstance.delete(`/products/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted successfully")
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

export const toggleFeatured = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      const response = await axiosInstance.patch(`/products/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated successfully")
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
