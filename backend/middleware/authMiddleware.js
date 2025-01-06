import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const protectRoute = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies
    if (!accessToken)
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token " })

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

      const user = await User.findById(decoded.userId)
      if (!user) return res.status(401).json({ message: "User not found " })

      req.user = user
      next()
    } catch (error) {
      if (error.name === "TokenExpiredError")
        return res
          .status(401)
          .json({ message: "Unauthorized - Token expired " })

      throw error
    }
  } catch (error) {
    console.log("Error in protectRoute controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const adminRoute = (req, res, next) => {
  if (req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied - Admin only" })
  }
}
