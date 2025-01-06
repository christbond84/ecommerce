import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/authRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import couponRoute from "./routes/couponRoute.js"
import paymentRoute from "./routes/paymentRoute.js"
import analyticsRoute from "./routes/analyticsRoute.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: "true" }))
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/coupons", couponRoute)
app.use("/api/payments", paymentRoute)
app.use("/api/analytics", analyticsRoute)

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT)
  connectDB()
})
