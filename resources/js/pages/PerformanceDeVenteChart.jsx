import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', leads: 4000, ventes: 2400, objectif: 5000 },
  { name: 'Fév', leads: 3000, ventes: 1398, objectif: 5000 },
  { name: 'Mar', leads: 2000, ventes: 9800, objectif: 5000 },
  { name: 'Avr', leads: 2780, ventes: 3908, objectif: 5000 },
  { name: 'Mai', leads: 1890, ventes: 4800, objectif: 5000 },
  { name: 'Juin', leads: 2390, ventes: 3800, objectif: 5000 },
];

const PerformanceDeVenteChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ventes" fill="#4F46E5" />
        <Bar dataKey="leads" fill="#10B981" />
        <Bar dataKey="objectif" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceDeVenteChart;