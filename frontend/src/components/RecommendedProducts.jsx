import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner"

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecommendations = async () => {
    try {
      const res = await axiosInstance.get("/products/recommended")
      setRecommendations(res.data.products)
    } catch (error) {
      toast.error(
        error.response.data.error ||
          error.response.data.message ||
          "An error occured"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RecommendedProducts
