import express from "express"
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/authController.js"
import { protectRoute } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh", refreshToken)
router.get("/profile", protectRoute, getProfile)

export default router
