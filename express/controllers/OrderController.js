import Order from "../models/Order.js";
import Product from "../models/Product.js";
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
      .limit(limit); // optional: latest first

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
        const order = await Order.findById(req.params.id);
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
    const { userId, orderItems, shipping } = req.body;

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

      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      product.stock -= quantity;
      await product.save();

      totalAmount += price * quantity;

      itemsSnapshot.push({
        product: {
          _id: product._id,
          name: product.name,
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
    const { userId, orderItems, shipping, payed } = req.body;

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

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    let totalAmount = 0;
    const itemsSnapshot = [];

    for (const item of orderItems) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: `Invalid product: ${productId}` });
      }

      const newQty = Number(item.quantity) || 0;
      if (newQty <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      // Get old quantity in the existing order
      const oldItem = existingOrder.orderItems.find(i => i.product._id.toString() === productId.toString());
      const oldQty = oldItem ? oldItem.quantity : 0;

      const diff = newQty - oldQty; // positive → increase, negative → decrease

      if (diff > 0 && product.stock < diff) {
        return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
      }

      // Update stock
      product.stock -= diff; // diff can be negative → returns stock
      await product.save();

      totalAmount += product.price * newQty;

      itemsSnapshot.push({
        product: {
          _id: product._id,
          name: product.name,
        },
        quantity: newQty,
        price: product.price,
      });
    }

    totalAmount += 5; // shipping fee

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        user: { _id: existingUser._id, name: existingUser.name },
        orderItems: itemsSnapshot,
        shipping,
        totalAmount,
        payed: !!payed,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update many
export const updateMany = async (req, res) => {
    try {
        const { ids, updates } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }

        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ message: "No update data provided" });
        }

        const result = await Order.updateMany(
            { _id: { $in: ids }},
            { $set: updates }
        );

        res.status(200).json({
            message: "Orders updated successfully",
            // matched: result.matchedCount,
            // modified: result.modifiedCount,
        });
        
    } catch (error) {
        res.status(500).json({message: error.message });
    }
}

// Delete an order
export const deleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    
    await Order.deleteMany(
      { _id: { $in: ids }}
    );

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
