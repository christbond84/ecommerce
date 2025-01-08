import Product from "../models/productsModel.js"

export const getCart = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } })
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (item) => item._id.toString() === product._id.toString()
      )
      return { ...product.toJSON(), quantity: item.quantity }
    })
    res.json({ cartItems, cartTotals: req.user.cartTotals })
  } catch (error) {
    console.log("Error in getCart controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body

    const user = req.user
    const existingItem = user.cartItems.find(
      (item) => item._id.toString() === productId
    )

    if (existingItem) existingItem.quantity += 1
    else user.cartItems.push(productId)

    await user.save()
    res.json(user.cartItems)
  } catch (error) {
    console.log("Error in addToCart controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deleteFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params

    const user = req.user

    if (!productId) user.cartItems = []
    else
      user.cartItems = user.cartItems.filter(
        (item) => item._id.toString() !== productId
      )
    await user.save()

    res.json(user.cartItems)
  } catch (error) {
    console.log("Error in deleteFromCart controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params
    const { quantity } = req.body
    const user = req.user

    const existingItem = user.cartItems.find(
      (item) => item._id.toString() === productId
    )
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item._id !== productId)
        await user.save()
        return res.json(user.cartItems)
      }

      existingItem.quantity = quantity
      await user.save()
      return res.json(user.cartItems)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.log("Error in updateQuantity controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateTotal = async (req, res) => {
  try {
    const user = req.user
    user.cartTotals = req.body.cartTotals
    await user.save()
  } catch (error) {
    console.log("Error in updateCartTotals controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
