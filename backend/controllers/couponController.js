import Coupon from "../models/couponModel.js"

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    })
    res.json(coupon || null)
  } catch (error) {
    console.log("Error in getCoupon controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await Coupon.findOne({
      code: code.trimEnd(),
      userId: req.user._id,
      isActive: true,
    })

    if (!coupon) return res.status(404).json({ message: "Coupon not found" })

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false
      await coupon.save()
      return res.status(404).json({ message: "Coupon expired" })
    }
    coupon.isActive = false
    await coupon.save()

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    })
  } catch (error) {
    console.log("Error in validateCoupon controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const acivateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      { isActive: true }
    )
    res.json(coupon || null)
  } catch (error) {
    console.log("Error in getCoupon controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deacivateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      { isActive: false }
    )
    res.json(coupon || null)
  } catch (error) {
    console.log("Error in getCoupon controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
