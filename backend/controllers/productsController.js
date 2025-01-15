import { redis } from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"
import Product from "../models/productsModel.js"

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.status(200).json({ products })
  } catch (error) {
    console.log("Error in getAllProducts controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts")
    if (featuredProducts)
      return res
        .status(200)
        .json({ featuredProducts: JSON.parse(featuredProducts) })

    featuredProducts = await Product.find({ isFeatured: true }).lean()
    if (!featuredProducts)
      return res.status(404).json({ message: "No featured products found" })
    await redis.set("featuredProducts", JSON.stringify(featuredProducts))

    res.status(200).json({ featuredProducts })
  } catch (error) {
    console.log("Error in getFeaturedProducts controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body
    let cloudinaryResponse = null

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      })
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category,
    })
    res.status(201).json({ product })
  } catch (error) {
    console.log("Error in createProduct controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { _id, name, description, price, image, category } = req.body
    const updateProduct = await Product.findById(_id)

    if (updateProduct) {
      if (updateProduct.image) {
        const publicId = updateProduct.image.split("/").pop().split(".")[0]
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`)
          console.log("Deleted image from cloudinary")
        } catch (error) {
          console.log("Error deleting image from cloudinary", error.message)
        }
      }

      let cloudinaryResponse = null
      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        })
      }
      updateProduct.name = name
      updateProduct.description = description
      updateProduct.price = price
      updateProduct.image = cloudinaryResponse?.secure_url || ""
      updateProduct.category = category

      const updatedProduct = await updateProduct.save()
      return res.status(200).json({ updatedProduct })
    } else {
      return res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.log("Error in toggleFeatured controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`)
        console.log("Deleted image from cloudinary")
      } catch (error) {
        console.log("Error deleting image from cloudinary", error.message)
      }
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Product deleted" })
  } catch (error) {
    console.log("Error in deleteProduct controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          description: 1,
          price: 1,
        },
      },
    ])
    res.json({ products })
  } catch (error) {
    console.log("Error in getRecommendedProducts controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const products = await Product.find({ category })
    res.json({ products })
  } catch (error) {
    console.log("Error in getProductsByCategory controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      product.isFeatured = !product.isFeatured
      const updatedProduct = await product.save()
      const featuredProducts = await Product.find({ isFeatured: true }).lean()
      await redis.set("featuredProducts", JSON.stringify(featuredProducts))
      return res.status(200).json({ updatedProduct })
    } else {
      return res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.log("Error in toggleFeatured controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
