import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import Shipping from "../models/Shipping.js";
import User from "../models/User.js";
// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    let { search, user, product, status, paid, page, limit } = req.query;

    const query = {};
    
    // Convert pagination values
    page = Number(page) || 1;
    limit = Number(limit) || 50;
    const skip = (page - 1) * limit;
    
    // Search filter
    if (search) {
      const orQuery = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
      
      const totalAmount = Number(search);
      if (!isNaN(totalAmount)) {
        orQuery.push({ totalAmount });
      }
      
      query.$or = orQuery;
    }
    
    // Status filter
    if (status) query.status = status;
    
    // User filter (match by ObjectId)
    if (user) query['user._id'] = user;
    if (product) query['orderItems.product._id'] = product;

    if(paid !== undefined) query.paid = paid;

    const totalItems = await Order.countDocuments(query);

    // Find orders and populate user info
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'orderItems', populate: { path: 'product'}});

    res.status(200).json({
      orders,
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


// Get orders for user
export const getOrdersForUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ "user._id" : userId})
          .populate({ path: 'orderItems', populate: { path: 'product' }});
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
          .populate([
            { path: 'user', select: '-password'},
            { path: 'shipping' },
            { path: 'orderItems', populate: { path: 'product'}}
          ]);       
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const orderItems = await OrderItem.find({'order': order._id});
        res.status(200).json({
          order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

export const createOrder = async (req, res) => {
  try {
    if (!req.body.user || !req.body.shipping || !req.body.shippingCost || !req.body.paymentMethod) {
      return res.status(400).json({ message: 'Please fill all required fields!' });
    }

    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const shipping = await Shipping.findById(req.body.shipping).populate('user');
    if (!shipping) {
      return res.status(400).json({ message: 'Shipping not found' });
    }
    if (!shipping.user._id.equals(user._id)) {
      return res.status(400).json({ message: "Shipping does not belong to this user!" });
    }


    const order = await Order.create({
      user: user._id,
      shipping: shipping._id,
      paymentMethod: req.body.paymentMethod,
      shippingCost: req.body.shippingCost,
      subtotal: 0,
      status: 'draft'
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order"
    });
  }
};

export const createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { user_id, shipping_id, payment_method, cart } = req.body;

    // ---------- Validation ----------
    if (!user_id || !shipping_id || !payment_method || !Array.isArray(cart)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (!["credit", "paypal", "cod"].includes(payment_method)) {
      return res.status(422).json({ message: "Invalid payment method" });
    }

    for (const item of cart) {
      if (!item.product_id || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(422).json({ message: "Invalid cart items" });
      }
    }

    // ---------- Transaction ----------
    await session.withTransaction(async () => {
      // Create draft order
      const order = await Order.create(
        [
          {
            user: user_id,
            shipping: shipping_id,
            payment_method,
            subtotal: 0,
            shipping_cost: 0,
            status: "draft",
          },
        ],
        { session }
      );

      const createdOrder = order[0];

      for (const item of cart) {
        const product = await Product.findById(item.product_id).session(session);

        if (!product || item.quantity > product.stock) {
          // Skip item (same as Laravel `continue`)
          continue;
        }

        // Check existing order item
        const existingItem = await OrderItem.findOne({
          order: createdOrder._id,
          product: product._id,
        }).session(session);

        if (existingItem) {
          // Restore stock
          product.stock += existingItem.quantity;
          await product.save({ session });

          await existingItem.deleteOne({ session });
        }

        // Create new order item
        await OrderItem.create(
          [
            {
              order: createdOrder._id,
              product: product._id,
              quantity: item.quantity,
              price: product.price,
            },
          ],
          { session }
        );

        // Decrement stock
        product.stock -= item.quantity;
        await product.save({ session });
      }

      // Move order to pending
      createdOrder.status = "pending";
      await createdOrder.save({ session });

      // Populate response
      await createdOrder.populate({
        path: "orderItems",
        populate: { path: "product" },
      });

      res.status(201).json({
        message: "Order created successfully",
        order: createdOrder,
      });
    });
  } catch (error) {
    console.error("createOrderFromCart error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Update an existing order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Change user (admin only, usually)
    if (req.body.user) {
      const user = await User.findById(req.body.user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      order.user = user._id;
    }

    // Change shipping
    if (req.body.shipping) {
      const shipping = await Shipping.findById(req.body.shipping);
      if (!shipping) {
        return res.status(404).json({ message: 'Shipping not found' });
      }

      // Ownership check
      if (!shipping.user.equals(order.user)) {
        return res.status(400).json({
          message: 'Shipping does not belong to this user'
        });
      }

      order.shipping = shipping._id;
    }

    if (req.body.paymentMethod) {
      order.paymentMethod = req.body.paymentMethod;
    }

    if (req.body.shippingCost) {
      order.shippingCost = req.body.shippingCost;
    }

    await order.save();

    return res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update order',
      error: error.message
    });
  }
};

export const updateMany = async (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "No update data provided" });
    }

    // ✅ Whitelist allowed fields
    const allowedFields = ["status", "paid"];
    const sanitizedUpdates = {};

    for (const key of allowedFields) {
      if (key in updates) {
        sanitizedUpdates[key] = updates[key];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // 1️⃣ Fetch orders
    const orders = await Order.find({ _id: { $in: ids } });

    if (orders.length !== ids.length) {
      return res.status(404).json({
        message: "One or more orders not found",
      });
    }

    // 2️⃣ Validate business rules
    const invalidOrder = orders.find(
      order =>
        !["draft", "preparing", "pending", "processing"].includes(order.status)
    );

    if (invalidOrder) {
      return res.status(422).json({
        message: "One or more orders cannot be updated in their current status",
      });
    }

    // 3️⃣ Paid logic
    if ("paid" in sanitizedUpdates) {
      sanitizedUpdates.paidAt = sanitizedUpdates.paid ? new Date() : null;
    }

    // 4️⃣ Update
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: sanitizedUpdates }
    );

    return res.status(200).json({
      message: "Orders updated successfully",
      updated: result.modifiedCount,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete an order
export const deleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    // 1️⃣ Fetch orders once
    const orders = await Order.find({ _id: { $in: ids } });

    // 2️⃣ Validate all orders
    const invalidOrder = orders.find(
      order => order.status !== 'draft' && order.status !== 'cancelled'
    );

    if (invalidOrder) {
      return res.status(422).json({
        message: "Only draft or cancelled orders can be deleted",
      });
    }

    // 3️⃣ Delete
    const result = await Order.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      message: "Orders deleted successfully",
      deleted: result.deletedCount,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};