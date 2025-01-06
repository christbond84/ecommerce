import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.post("/products", productData)
      set((prev) => ({
        products: [...prev.products, res.data],
        loading: false,
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true })
    try {
      const res = await axiosInstance.get("/products")
      set({ products: res.data.products, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.get(`/products/category/${category}`)
      set({ products: res.data.products, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true })
    try {
      await axiosInstance.delete(`/products/${productId}`)
      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
        loading: false,
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  toggleFeatured: async (productId) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.patch(`/products/${productId}`)
      set((prev) => ({
        products: prev.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.updatedProduct.isFeatured }
            : product
        ),
        loading: false,
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true })
    try {
      const res = await axiosInstance.get("/products/featured")
      set({ products: res.data.featuredProducts, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },
}))
