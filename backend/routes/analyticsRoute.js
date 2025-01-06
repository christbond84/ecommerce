import express from "express"
import { adminRoute, protectRoute } from "../middleware/authMiddleware.js"
import {
  getAnalyticsData,
  getSalesData,
} from "../controllers/analyticsController.js"
const router = express.Router()

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData()

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    const salesData = await getSalesData(startDate, endDate)

    res.json({ analyticsData, salesData })
  } catch (error) {
    console.log("Error in analytics route ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router