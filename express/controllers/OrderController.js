import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
      const { search, status, payed } = req.query;
      const query = {};

      if (search) {
        const orQuery = [
            { 'user.name': { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } }
        ];

        const totalAmount = Number(search);
        if (!isNaN(totalAmount)) {
            orQuery.push({ totalAmount });
        }

        query.$or = orQuery;
      }

      if (status) query.status = status;
      if (payed !== undefined) query.payed = payed;

      const orders = await Order.find(query);
      const validOrders = orders.filter(order => order.user);
      res.status(200).json(validOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get orders for user
export const getOrdersForUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ "user._id" : userId});
          // .populate('orderItems.product', "title");
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
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

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shipping } = req.body;
    const userId = req.user._id;
    console.log(req.body);

    // 🔐 Basic validation
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    if (
      !shipping?.address1 ||
      !shipping?.city ||
      !shipping?.zip ||
      !shipping?.country ||
      !shipping?.paymentMethod
    ) {
      return res.status(400).json({ message: "Incomplete shipping data" });
    }

    // 👤 Validate user
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    let totalAmount = 0;
    const itemsSnapshot = [];

    for (const item of orderItems) {
      const productId = item.product?._id || item.product;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: "Invalid product in order" });
      }

      const quantity = Number(item.quantity) || 0;
      const price = Number(product.price) || 0;

      if (quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      totalAmount += price * quantity;

      itemsSnapshot.push({
        product: {
          _id: product._id,
          title: product.title,
        },
        quantity,
        price,
      });
    }

    totalAmount += 5; // shipping fee

    const order = await Order.create({
      user: {
        _id: existingUser._id,
        name: existingUser.name,
      },
      orderItems: itemsSnapshot,
      shipping,
      totalAmount,
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
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
      .populate("orderItems.product", "title price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

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
