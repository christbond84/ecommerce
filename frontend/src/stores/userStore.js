import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast"

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true })
    if (password !== confirmPassword) {
      set({ loading: false })
      return toast.error("Passwords do not match")
    }
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      })
      set({ user: res.data, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.post("/auth/login", { email, password })
      set({ user: res.data, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ user: null })
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    }
  },

  checkAuth: async () => {
    try {
      set({ checkingAuth: true })
      const res = await axiosInstance.get("/auth/profile")
      set({ user: res.data, checkingAuth: false })
    } catch (error) {
      console.log(error)
      set({ checkingAuth: false, user: null })
    }
  },

  // refreshToken: async () => {
  //   if (get().checkingAuth) return
  //   try {
  //     set({ checkingAuth: true })
  //     const response = await axios.get("/auth/refresh")
  //     return response.data
  //   } catch (error) {
  //     set({ user: null })
  //     throw error
  //   } finally {
  //     set({ checkingAuth: false })
  //   }
  // },
}))

// let refreshPromise = null

// axios.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// axios.interceptors.response.use(

//   (response) => response,
//   async (error) => {
//     const prevRequest = error.config
//     if (error?.response?.status === 401 && !prevRequest?.sent) {
//       prevRequest.sent = true
//       try {
//         if (refreshPromise) {
//           await refreshPromise
//           return axios(prevRequest)
//         }

//         refreshPromise = useUserStore.getState().refreshToken()
//         await refreshPromise
//         refreshPromise = null
//         return axios(prevRequest)
//       } catch (refreshError) {
//         useUserStore.getState().logout()
//         return Promise.reject(refreshError)
//       }
//     }
//     return Promise.reject(error)
//   }
// )
