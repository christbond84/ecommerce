import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
import {
  getCoupon,
  validateCoupon,
  acivateCoupon,
} from "../controllers/couponController.js"

const router = express.Router()

router.get("/", protectRoute, getCoupon)
router.post("/validate", protectRoute, validateCoupon)
router.post("/activate", protectRoute, acivateCoupon)

export default router
