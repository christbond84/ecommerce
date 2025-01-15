import axios from "axios"
import useRefreshToken from "../hooks/useRefreshToken"

const refresh = useRefreshToken()

export default axios.create({
  baseURL:
    import.meta.env.MODE === "deve-lopment"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
})

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "deve-lopment"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true
      try {
        refresh()
        return axiosInstance(prevRequest)
      } catch (refreshError) {
        // logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
