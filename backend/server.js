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
import path from "path"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const _dirname = path.resolve()
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: "true" }))
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/coupons", couponRoute)
app.use("/api/payments", paymentRoute)
app.use("/api/analytics", analyticsRoute)

app.use(express.static(path.join(_dirname, "frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT)
  connectDB()
})
