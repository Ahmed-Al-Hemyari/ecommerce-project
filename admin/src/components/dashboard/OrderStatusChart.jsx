import React from 'react'
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const STATUS_COLORS = {
  draft: '#FBBF24',
  pending: '#9CA3AF',
  processing: '#60A5FA',
  shipped: '#A78BFA',
  delivered: '#4ADE80',
  cancelled: '#F87171',
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
