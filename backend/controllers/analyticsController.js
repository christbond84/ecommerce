import Order from "../models/orderModel.js"
import Product from "../models/productsModel.js"
import User from "../models/userModel.js"

export const getAnalyticsData = async () => {
  try {
    const users = await User.countDocuments()
    const products = await Product.countDocuments()

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ])
    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    }

    return {
      users,
      products,
      totalSales,
      totalRevenue,
    }
  } catch (error) {
    throw error
  }
}
export const getSalesData = async (startDate, endDate) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const datesArray = getDatesInRange(startDate, endDate)

    return datesArray.map((date) => {
      const data = salesData.find((item) => item._id === date)

      return {
        date,
        sales: data?.sales || 0,
        revenue: data?.revenue || 0,
        profit: data?.revenue - 500 || 0,
      }
    })
  } catch (error) {
    throw error
  }
}

function getDatesInRange(startDate, endDate) {
  const dates = []

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}
