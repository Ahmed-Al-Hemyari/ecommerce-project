import React from 'react'
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts'

const SalesLineChart = ({ salesByDay = [] }) => {
  if (!salesByDay.length) return null;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesByDay}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" />
          <Line type="monotone" dataKey="orders" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesLineChart
