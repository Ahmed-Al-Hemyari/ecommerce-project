import OrderItem from '../models/OrderItem.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js';
import calculateStock from '../utils/calculateStock.js'

export const getOrderItemById = async (req, res) => {
    try {
        const orderItem = await OrderItem.findById(req.params.id)
            .populate([
                { path: 'product', populate: [{path: 'brand'}, {path: 'category'}]},
            ]);
        
        res.status(200).json({ orderItem });
    } catch (error) {
        res.status(500).json({ message: `Failed to get order item ${error}`})
    }
}

export const createOrderItem = async (req, res) => {
  try {
    const { product, order, quantity } = req.body;

    if (!product || !order || quantity == null) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(422).json({ message: "Quantity must be a positive integer" });
    }

    const fetchedProduct = await Product.findById(product);
    if (!fetchedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const fetchedOrder = await Order.findById(order);
    if (!fetchedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (fetchedOrder.status !== "draft") {
      return res.status(422).json({
        message: "Cannot add items to a finalized order",
      });
    }

    const existingItem = await OrderItem.findOne({
      order: fetchedOrder._id,
      product: fetchedProduct._id,
    });

    const oldQty = existingItem?.quantity ?? 0;
    const stock = calculateStock(oldQty, qty, fetchedProduct.stock);

    if (stock < 0) {
      return res.status(422).json({ message: "Insufficient stock" });
    }

    fetchedProduct.stock = stock;
    await fetchedProduct.save();

    let orderItem;

    if (existingItem) {
      existingItem.quantity = qty;
      await existingItem.save();
      orderItem = existingItem;
    } else {
      orderItem = await OrderItem.create({
        order: fetchedOrder._id,
        product: fetchedProduct._id,
        quantity: qty,
        price: fetchedProduct.price,
      });
    }

    fetchedOrder.subtotal = (orderItem.price * orderItem.quantity);
    await fetchedOrder.save();

    return res.status(201).json({
      message: "Order item saved successfully",
      orderItem,
    });
  } catch (error) {
    console.error("createOrderItem error:", error);
    return res.status(500).json({
      message: "Failed to create order item",
      error: error.message,
    });
  }
};

// export const updateOrderItem = async (req, res) => {
//   try {
//     const { quantity, product } = req.body;

//     const orderItem = await OrderItem.findById(req.params.id);
//     if (!orderItem) {
//       return res.status(404).json({ message: "Order item not found!" });
//     }

//     const newQty =
//       quantity !== undefined ? Number(quantity) : orderItem.quantity;

//     if (!Number.isInteger(newQty) || newQty <= 0) {
//       return res.status(422).json({ message: "Quantity must be greater than zero" });
//     }

//     const order = await Order.findById(orderItem.order);
//     if (!order || order.status !== "draft") {
//       return res.status(422).json({
//         message: "Cannot modify items of a finalized order",
//       });
//     }

//     const oldProduct = await Product.findById(orderItem.product);
//     if (!oldProduct) {
//       return res.status(404).json({ message: "Old product not found!" });
//     }

//     const newProduct = product
//       ? await Product.findById(product)
//       : oldProduct;

//     if (!newProduct) {
//       return res.status(404).json({ message: "Product not found!" });
//     }

//     // ----- Stock logic -----
//     if (oldProduct._id.equals(newProduct._id)) {
//       // Same product, quantity change only
//       const stock = calculateStock(
//         orderItem.quantity,
//         newQty,
//         oldProduct.stock
//       );

//       if (stock < 0) {
//         return res.status(422).json({ message: "Insufficient stock!" });
//       }

//       oldProduct.stock = stock;
//       await oldProduct.save();
//     } else {
//       // Product changed
//       oldProduct.stock += orderItem.quantity;

//       if (newProduct.stock < newQty) {
//         return res.status(422).json({ message: "Insufficient stock!" });
//       }

//       newProduct.stock -= newQty;

//       await oldProduct.save();
//       await newProduct.save();
//     }

//     orderItem.product = newProduct._id;
//     orderItem.quantity = newQty;
//     await orderItem.save();

//     return res.status(200).json({
//       message: "Order item updated successfully",
//       orderItem,
//     });
//   } catch (error) {
//     console.error("updateOrderItem error:", error);
//     return res.status(500).json({
//       message: "Failed to update order item",
//       error: error.message,
//     });
//   }
// };

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

      const order = await Order.findById(item.order._id);
      if (!order) {
        return res.status(422).json({
          message: "Order not found!",
        });
      };
      order.subtotal -= (item.price * item.quantity);
      await order.save();

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
