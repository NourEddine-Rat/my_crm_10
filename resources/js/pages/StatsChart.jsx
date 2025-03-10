import { PieChart, Pie, Cell, Legend } from "recharts";

const StatsChart = ({ stats }) => {
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="p-4 bg-transparent shadow-md rounded-lg w-80">
      <h2 className="text-lg font-bold text-white-700 mb-4 text-center">
        Statistiques
      </h2>
      <PieChart width={300} height={300}>
        <Pie
          data={stats}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          label
        >
          {stats.map((entry, index) => (
            <Cell key={entry} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};

export default StatsChart;
