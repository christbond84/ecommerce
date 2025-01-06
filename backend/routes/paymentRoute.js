import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
import {
  checkoutSession,
  checkoutSuccess,
} from "../controllers/paymentController.js"
const router = express.Router()

router.post("/session", protectRoute, checkoutSession)
router.post("/success", protectRoute, checkoutSuccess)

export default router
