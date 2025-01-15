import express from "express"
import { protectRoute, adminRoute } from "../middleware/authMiddleware.js"
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeatured,
  updateProduct,
} from "../controllers/productsController.js"
const router = express.Router()

router.get("/", getAllProducts)
router.get("/featured", getFeaturedProducts)
router.get("/recommended", getRecommendedProducts)
router.get("/category/:category", getProductsByCategory)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeatured)
router.patch("/", protectRoute, adminRoute, updateProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)

export default router
