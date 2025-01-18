import Coupon from "../models/couponModel.js"
import Order from "../models/orderModel.js"
import { stripe } from "../lib/stripe.js"
import { sendMail } from "../utility/gmailsender.js"

export const checkoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body

    if (!Array.isArray(products) || products.length === 0)
      return res
        .status(400)
        .json({ message: "Invalid or empty products array" })

    let totalAmount = 0

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100)
      totalAmount += amount * product.quantity

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      }
    })

    let coupon = null
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      })
      if (coupon)
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode,
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    })

    if (totalAmount > 20000) await createNewCoupon(req.user._id)
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 })
  } catch (error) {
    console.log("Error in checkoutSession controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        )
      }

      const products = JSON.parse(session.metadata.products)

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      })

      await newOrder.save()

      const msg = `<div>
          <h1>Order Confirmation</h1>
          <p>Dear ${req.user.name}, Your order is confirmed</p>
          <h3>Order number: ${newOrder._id}</h3>
          <h2>Order details</h2>
          <table style="border:1px solid black">
            <tbody>
              <tr>
                <th style="border:1px solid black">Product</th>
                <th style="border:1px solid black">Quantity</th>
                <th style="border:1px solid black">Price</th>
              </tr>              
              ${products.map(
                (product) =>
                  `<tr>
                <td style="border:1px solid black">${product.name}</td>
                <td style="border:1px solid black">${product.quantity}</td>
                <td style="border:1px solid black">${product.price}</td>
                </tr>`
              )}
              <tr>
                <td colspan="2" style="border:1px solid black">
                  Total price
                  <span style="font-size:10px">after discount if any</span>
                </td>
                <td style="border:1px solid black">
                  ${session.amount_total / 100}
                </td>
              </tr>
            </tbody>
          </table>
          <p>Estimated delivery 3-5 business days</p>
          <h4>Thanks for trusting us!</h4>
        </div>`

      sendMail(req.user.email, "Order Confirmation", msg)

      res.status(201).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      })
    }
  } catch (error) {
    console.log("Error in checkoutSuccess controller ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  })
  return coupon.id
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId: userId })

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  })
  await newCoupon.save()
  return newCoupon
}
