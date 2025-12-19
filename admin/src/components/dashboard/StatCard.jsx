const StatCard = ({ label, value }) => (
  <div className="bg-card p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);


export default StatCard