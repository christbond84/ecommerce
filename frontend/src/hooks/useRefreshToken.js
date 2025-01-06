import axios from "../lib/axios"

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.get("/auth/refresh")
    return response.data
  }
  return refresh
}

export default useRefreshToken
