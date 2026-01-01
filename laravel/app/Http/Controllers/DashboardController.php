<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request) {
        $stats = $this->getStats();
        $salesByDay = $this->getSalesByDay();
        $ordersStatus = $this->getOrdersStatus();
        $recentOrders = $this->getRecentOrders();
        $lowStockProducts = $this->getLowStockProducts();

        return response()->json([
            'stats' => $stats,
            'salesByDay' => $salesByDay,
            'ordersStatus' => $ordersStatus,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }

    private function getStats() {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalUsers = User::where('role', 'user')->count();
        $totalProducts = Product::count();

        $revenue = Order::where('is_paid', true)->sum('total');

        return [
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'totalUsers' => $totalUsers,
            'totalProducts' => $totalProducts,
            'totalRevenue' => $revenue,
        ];
    }

    private function getSalesByDay() {
        $sales = Order::where('is_paid', true)
            ->selectRaw('DATE(created_at) as _id, COUNT(*) as orders, SUM(total) as revenue')
            ->groupBy('_id')
            ->orderBy('_id', 'asc')
            ->get();

        return $sales;
    }

    private function getOrdersStatus() {
        $statusCounts = Order::selectRaw('status as status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return $statusCounts;
    }

    private function getRecentOrders() {
        $orders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        return OrderResource::collection($orders);
    }

    private function getLowStockProducts() {
        $products = Product::with('category', 'brand')->where('stock', '<', 10)
            ->orderBy('stock', 'asc')
            ->get();

        return ProductResource::collection($products);
    }
}
