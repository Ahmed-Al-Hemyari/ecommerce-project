import { 
    getLowStockProducts, 
    getOrderStatus, 
    getRecentOrders, 
    getSalesByDay, 
    getStats 
} from "../services/dashboard.service.js"

export const getDashboardData = async (req, res) => {
    try {
        const [
            stats,
            salesByDay,
            orderStatus,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            getStats(),
            getSalesByDay(),
            getOrderStatus(),
            getRecentOrders(),
            getLowStockProducts(),
        ]);

        res.status(200).json({
            stats,
            salesByDay,
            orderStatus,
            recentOrders,
            lowStockProducts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load dashboard data' });
    }
}