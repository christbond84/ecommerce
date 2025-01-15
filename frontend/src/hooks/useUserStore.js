import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import axios from "../lib/axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export const checkAuth = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/profile")
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
    refetchOnWindowFocus: true,
  })
}

export const logout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout")
    },
    onSuccess: () => {
      // queryClient.removeQueries({ queryKey: ["coupon"], exact: true })
      // queryClient.removeQueries({ queryKey: ["cart"], exact: true })
      // queryClient.removeQueries({ queryKey: ["products"], exact: true })
      // queryClient.removeQueries({ queryKey: ["user"], exact: true })
      queryClient.setQueryData(["user"], null)
      // queryClient.setQueryData(["cart"], null)
      // queryClient.setQueryData(["coupon"], null)
      // queryClient.removeQueries({ queryKey: ["user"] })
      queryClient.resetQueries({ queryKey: ["cart"] })
      queryClient.resetQueries({ queryKey: ["coupon"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })

      navigate("/login")
      // toast.success("Logged out successfully")
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

export const signup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, email, password, confirmPassword }) => {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        throw new Error()
      }
      const response = await axios
        .post("/auth/signup", {
          name,
          email,
          password,
        })
        .catch((error) => {
          toast.error(
            error.response.data.error ||
              error.response.data.message ||
              "An error occured"
          )
        })
      queryClient.setQueryData(["user"], response?.data?.user)
    },
  })
}

export const login = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios
        .post("/auth/login", {
          formData,
        })
        .catch((error) => {
          toast.error(
            error.response.data.error ||
              error.response.data.message ||
              "An error occured"
          )
        })
      queryClient.setQueryData(["user"], response?.data?.user)
      return response
    },
  })
}
