import StatCard from "./StatCard";

const StatsGrid = ({ stats }) => {
  const items = [
    { label: "Orders", value: stats.totalOrders },
    { label: "Revenue", value: stats.totalRevenue },
    { label: "Products", value: stats.totalProducts },
    { label: "Users", value: stats.totalUsers },
    { label: "Pending", value: stats.pendingOrders }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map(item => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StatsGrid