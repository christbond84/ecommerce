import { motion } from "framer-motion"
import { Trash, Star, PenBox } from "lucide-react"
import { Link } from "react-router-dom"
import {
  fetchAllProducts,
  deleteProduct,
  toggleFeatured,
} from "../hooks/useProductsStore"

const ProductsList = () => {
  const { data: products, isSuccess } = fetchAllProducts()
  const { mutate: deleteProductMutation } = deleteProduct()
  const { mutate: toggleFeaturedMutation } = toggleFeatured()

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className=" min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {isSuccess &&
            products?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    ${product.price?.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.category}
                  </div>
                </td>
                <td className="px-10 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      toggleFeaturedMutation(product._id)
                    }}
                    className={`p-1 rounded-full ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-3 py-4 flex whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => deleteProductMutation(product._id)}
                    className="text-red-400 hover:text-red-300 mr-10"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <Link
                    className="text-green-500 hover:text-green-300"
                    to={`/updateproduct?productId=${product._id}`}
                  >
                    <PenBox className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </motion.div>
  )
}

export default ProductsList
