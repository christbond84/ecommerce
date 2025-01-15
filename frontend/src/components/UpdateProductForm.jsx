import { useState } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  Loader,
  PenBox,
  PlusCircle,
  ShoppingBasket,
  BarChart,
} from "lucide-react"
import { updateProduct } from "../hooks/useProductsStore"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
  "smartwatches",
]

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
]

const UpdateProductForm = () => {
  const queryClient = useQueryClient()
  const productId = new URLSearchParams(window.location.search).get("productId")
  const existingProduct = queryClient
    .getQueryData(["products"])
    .filter((item) => item._id === productId)
  const navigate = useNavigate()
  const { mutate: updateProductMutation, isPending } = updateProduct()
  const [product, setProduct] = useState({
    _id: existingProduct[0]?._id,
    name: existingProduct[0]?.name,
    description: existingProduct[0]?.description,
    price: existingProduct[0]?.price,
    category: existingProduct[0]?.category,
    image: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProductMutation(product)
    setProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    })
    navigate("/dashboard")
  }

  const changeHandler = (e) => {
    setProduct({ ...product, [e.target.id]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }
  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.h1
            className="text-4xl font-bold mb-8 text-emerald-400 text-center"
            initial={{ opacity: 0, y: -20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-300
                 bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-not-allowed"
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
              Update Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Product name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={changeHandler}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
			px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Desccription
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={changeHandler}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
			px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={changeHandler}
                  step="0.01"
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
			px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={changeHandler}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
			px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImage}
                  className="sr-only"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Upload className="h-5 w-5 inline-block mr-2" />
                  Upload Image
                </label>
                {product.image && (
                  <span className="ml-3 text-sm text-gray-400">
                    Image uploaded{" "}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
		  shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
		  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <PenBox className="mr-2 h-5 w-5" />
                    Update Product
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default UpdateProductForm
