import OrderItem from '../models/OrderItem.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js';

export const getOrderItemById = async (req, res) => {
    try {
        const orderItem = OrderItem.findById(req.params.id)
            .populate(
                { path: 'product', populate: [{path: 'brand'}, {path: 'category'}]},
                { path: 'order', populate: [{path: 'user'}, {path: 'orderItem'}]}
            );
        
        res.status(200).json({ orderItem });
    } catch (error) {
        res.status(500).json({ message: `Failed to get order item ${error}`})
    }
}

export const createOrderItem = async (req, res) => {
  try {
    const { product: productId, order: orderId, quantity } = req.body;

    // ---------- Validation ----------
    if (!productId || !orderId || quantity == null) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(422).json({
        message: "Quantity must be a positive integer",
      });
    }

    // ---------- Fetch product ----------
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ---------- Fetch order ----------
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ---------- Order must be draft ----------
    if (order.status !== "draft") {
      return res.status(422).json({
        message: "Cannot add items to a finalized order",
      });
    }

    // ---------- Find existing item ----------
    const existingItem = await OrderItem.findOne({
      order: order._id,
      product: product._id,
    });

    const oldQty = existingItem ? existingItem.quantity : 0;
    const newQty = oldQty + qty;
    const diff = newQty - oldQty; // = qty

    // ---------- Stock check (ONLY difference) ----------
    if (diff > product.stock) {
      return res.status(422).json({
        message: "Insufficient stock",
      });
    }

    let orderItem;

    if (existingItem) {
      // Update quantity
      existingItem.quantity = newQty;
      orderItem = await existingItem.save();
    } else {
      // Create new item
      orderItem = await OrderItem.create({
        order: order._id,
        product: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    // ---------- Deduct stock ----------
    product.stock -= diff;
    await product.save();

    return res.status(201).json({
      message: "Order item created successfully",
      orderItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create order item",
      error: error.message,
    });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const { quantity, product: newProductId } = req.body;

    if (quantity !== undefined && quantity <= 0) {
      return res.status(422).json({ message: "Quantity must be greater than zero" });
    }

    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    const order = await Order.findById(orderItem.order);
    if (!order || order.status !== "draft") {
      return res.status(422).json({
        message: "Cannot modify items of a finalized order",
      });
    }

    // Load current product
    let product = await Product.findById(orderItem.product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle product change
    if (newProductId && newProductId !== String(orderItem.product)) {
      const newProduct = await Product.findById(newProductId);
      if (!newProduct) {
        return res.status(404).json({ message: "New product not found" });
      }

      // Restore old product stock
      product.stock += orderItem.quantity;
      await product.save();

      product = newProduct;
      orderItem.product = newProduct._id;
    }

    // Handle quantity change
    if (quantity !== undefined) {
      const diff = quantity - orderItem.quantity;

      if (diff > 0 && diff > product.stock) {
        return res.status(422).json({ message: "Insufficient stock" });
      }

      product.stock -= diff;
      orderItem.quantity = quantity;
    }

    await product.save();
    await orderItem.save();

    return res.status(200).json({
      message: "Order item updated successfully",
      orderItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update order item",
      error: error.message,
    });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const items = await OrderItem.find({ _id: { $in: ids } })
      .populate(["order", "product"]);

    for (const item of items) {
      if (!item.order || item.order.status !== "draft") {
        return res.status(422).json({
          message: "Cannot delete items from a finalized order",
        });
      }
    }

    // All items valid → apply changes
    for (const item of items) {
      // Restore stock (atomic)
      await Product.updateOne(
        { _id: item.product._id },
        { $inc: { stock: item.quantity } }
      );

      // Hard delete
      await OrderItem.deleteOne({ _id: item._id });
    }

    return res.status(200).json({
      message: "Order item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete order items",
      error: error,
    });
  }
};
