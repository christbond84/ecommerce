import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js"

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  })
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })
  return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  )
}

const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 1000,
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    // domain: "app.localhost",
    path: "/api/auth",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExist = await User.findOne({ email })

    if (userExist)
      return res.status(400).json({ message: "User already exist" })
    const user = await User.create({ name, email, password })

    const { accessToken, refreshToken } = generateTokens(user._id)

    await storeRefreshToken(user._id, refreshToken)

    setCookie(res, accessToken, refreshToken)

    res.status(201).json({
      user: { ...user._doc, password: "" },
      message: "User created successfuly",
    })
  } catch (error) {
    console.log("Error in signup controller ", error.message)
    res.status(400).json({ message: "Error", error: error.message })
  }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id)
      await storeRefreshToken(user._id, refreshToken)
      setCookie(res, accessToken, refreshToken)

      res.status(200).json({
        user: { ...user._doc, password: "" },
        message: "User logged in successfuly",
      })
    } else res.status(400).json({ message: "Invalid credentials" })
  } catch (error) {
    console.log("Error in login controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      await redis.del(`refreshToken:${decoded.userId}`)
    }
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken", { path: "/api/auth" })
    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.log("Error in logout controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token missing" })

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`)
    if (refreshToken !== storedToken)
      return res.status(401).json({ message: "Invalid token" })

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    )

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 1000,
    })
    res.status(200).json({ message: "Token refreshed" })
  } catch (error) {
    console.log("Error in refresh controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.log("Error in getProfile controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
