import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
import {
  getCart,
  addToCart,
  deleteFromCart,
  updateQuantity,
} from "../controllers/cartController.js"

const router = express.Router()

router.get("/", protectRoute, getCart)
router.post("/", protectRoute, addToCart)
router.delete("/:id?", protectRoute, deleteFromCart)
router.put("/:id", protectRoute, updateQuantity)

export default router
