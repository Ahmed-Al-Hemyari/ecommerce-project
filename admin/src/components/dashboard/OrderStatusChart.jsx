import React from 'react'
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const STATUS_COLORS = {
  Pending: '#9CA3AF',
  Processing: '#60A5FA',
  Shipped: '#A78BFA',
  Delivered: '#4ADE80',
  Cancelled: '#F87171',
};

const OrderStatusChart = ({ orderStatus = [] }) => {
  if (!orderStatus.length) return null;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={orderStatus}
            dataKey="count"
            nameKey="status"
            outerRadius={100}
            label
          >
            {orderStatus.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || '#CBD5E1'}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OrderStatusChart
