import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js';

export const getStats = async () => {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
        {
            $match: {
                payed: true,
            },
        },
        {
            $group:{
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    return {
        totalOrders,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        totalProducts,
        totalUsers,
        pendingOrders,
    }
}

export const getSalesByDay = async () => {
    const last7DaysDate = new Date();
    last7DaysDate.setDate(last7DaysDate.getDate() - 7);

    const sales = await Order.aggregate([
            {
                $match: {
                    paid: true,
                    createdAt: {
                        $gte: last7DaysDate
                    }
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                }, 
            },
            {
                $sort: { _id: 1 },
            }
    ]);

    return sales;
}

export const getOrderStatus = async () => {
    const statusCounts = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ]);

    return statusCounts;
}

export const getRecentOrders = async () => {
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    return recentOrders;
}

export const getLowStockProducts = async () => {
    const products = await Product.aggregate([
        {
            $match: {
                stock: { $lte: 10 }
            }
        }
    ]);

    return products;
}