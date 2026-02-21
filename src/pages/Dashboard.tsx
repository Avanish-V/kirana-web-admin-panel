import { IndianRupee, ShoppingCart, Clock, TrendingUp, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Today's Sales",
    value: "₹12,450",
    change: "+12%",
    up: true,
    icon: IndianRupee,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Total Orders",
    value: "48",
    change: "+8%",
    up: true,
    icon: ShoppingCart,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Pending Deliveries",
    value: "7",
    change: "-3",
    up: false,
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Low Stock Items",
    value: "5",
    change: "+2",
    up: true,
    icon: Package,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

const recentOrders = [
  { id: "#1024", customer: "Ramesh Kumar", items: 5, total: "₹845", status: "Delivered" },
  { id: "#1023", customer: "Priya Sharma", items: 3, total: "₹520", status: "Pending" },
  { id: "#1022", customer: "Amit Patel", items: 8, total: "₹1,250", status: "Delivered" },
  { id: "#1021", customer: "Sunita Devi", items: 2, total: "₹310", status: "Out for Delivery" },
  { id: "#1020", customer: "Vikram Singh", items: 6, total: "₹975", status: "Pending" },
];

const topProducts = [
  { name: "Tata Salt (1kg)", sold: 32, revenue: "₹640" },
  { name: "Amul Butter (500g)", sold: 25, revenue: "₹1,225" },
  { name: "Aashirvaad Atta (5kg)", sold: 18, revenue: "₹5,220" },
  { name: "Fortune Oil (1L)", sold: 15, revenue: "₹2,385" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Delivered": return "bg-success/15 text-success border-0";
    case "Pending": return "bg-warning/15 text-warning border-0";
    case "Out for Delivery": return "bg-info/15 text-info border-0";
    default: return "";
  }
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your store overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.up ? (
                      <ArrowUpRight className="h-3 w-3 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs yesterday</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Order</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Customer</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Items</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Total</th>
                    <th className="text-left py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{order.id}</td>
                      <td className="py-3 pr-4">{order.customer}</td>
                      <td className="py-3 pr-4">{order.items}</td>
                      <td className="py-3 pr-4 font-medium">{order.total}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Selling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                </div>
                <p className="text-sm font-semibold">{product.revenue}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
