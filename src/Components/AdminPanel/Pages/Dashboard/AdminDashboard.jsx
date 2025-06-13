import {
  FaBoxOpen,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", earnings: 4000, orders: 2400, customers: 2400 },
  { month: "Feb", earnings: 3000, orders: 1398, customers: 2210 },
  { month: "Mar", earnings: 2000, orders: 9800, customers: 2290 },
  { month: "Apr", earnings: 2780, orders: 3908, customers: 2000 },
  { month: "May", earnings: 1890, orders: 4800, customers: 2181 },
  { month: "Jun", earnings: 2390, orders: 3800, customers: 2500 },
];

const stats = [
  {
    label: "Total Earnings",
    value: "51.6K",
    icon: <FaDollarSign />,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Total Orders",
    value: "85K",
    icon: <FaShoppingCart />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "Total Products",
    value: "4.5K",
    icon: <FaBoxOpen />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Total Customers",
    value: "11.6K",
    icon: <FaUsers />,
    color: "bg-orange-100 text-orange-700",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 space-y-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hello, Admin</h1>
        <p className="text-gray-500">Good Morning, Let's check your stats today!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl shadow p-4 flex justify-between items-center ${stat.color}`}
          >
            <div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-sm">{stat.label}</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Chart and Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Earnings</h3>
          <p className="text-sm text-gray-500 mb-4">January - June 2024</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#10B981" />
              <Line type="monotone" dataKey="orders" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="customers" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table 1 (Recent Orders) */}
         <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/40?img=3" className="w-10 h-10 rounded-full" alt="avatar" />
                  <div>
                    <h4 className="font-semibold text-sm">Olivia Martin</h4>
                    <p className="text-xs text-gray-500">martin@gmail.com</p>
                  </div>
                </div>
                <p className="text-sm font-bold">$1,000</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table 2 (New Customers) */}
     <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-semibold text-lg mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-gray-600">
                <th>S/No</th>
                <th>Product Name</th>
                <th>Product Code</th>
                <th>Product Category</th>
                <th>Total Sold Units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1</td>
                <td>3D LED Signage</td>
                <td><span className="btn btn-outline  btn-info">DPM001</span></td>
                <td>Award Crest</td>
                <td>120.4K</td>
              </tr>
              <tr>
                <td>#2</td>
                <td>Signage</td>
                <td><span className="btn btn-outline  btn-info">DPM003</span></td>
                <td>Award Crest</td>
                <td>20.4K</td>
              </tr>
              
              
            </tbody>
          </table>
        </div>
        </div>
    </div>
  );
}
