import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', "name email")
            .populate('orderItems.product', "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', "name email")
            .populate('orderItems.product', "name price");
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, orderItems, paymentMethod } = req.body;

    // Validate user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate items + calculate total
    let totalAmount = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: "Invalid product in order" });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user,
      orderItems,
      totalAmount,
      paymentMethod
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
