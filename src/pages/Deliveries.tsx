import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle, Clock, MapPin } from "lucide-react";

const deliveries = [
  { id: "#D-101", customer: "Ramesh Kumar", address: "Block A, Sector 12", items: 5, status: "Out for Delivery", time: "10:30 AM" },
  { id: "#D-102", customer: "Sunita Devi", address: "House 45, Main Rd", items: 2, status: "Pending", time: "11:00 AM" },
  { id: "#D-103", customer: "Priya Sharma", address: "Flat 3B, Green Park", items: 3, status: "Delivered", time: "09:15 AM" },
  { id: "#D-104", customer: "Vikram Singh", address: "Shop 7, Market Lane", items: 6, status: "Pending", time: "12:00 PM" },
  { id: "#D-105", customer: "Amit Patel", address: "Plot 22, Industrial Area", items: 8, status: "Delivered", time: "08:45 AM" },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "Delivered": return "bg-success/15 text-success border-0";
    case "Pending": return "bg-warning/15 text-warning border-0";
    case "Out for Delivery": return "bg-info/15 text-info border-0";
    default: return "";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Delivered": return <CheckCircle className="h-4 w-4 text-success" />;
    case "Pending": return <Clock className="h-4 w-4 text-warning" />;
    case "Out for Delivery": return <Truck className="h-4 w-4 text-info" />;
    default: return null;
  }
}

export default function Deliveries() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deliveries</h1>
        <p className="text-muted-foreground text-sm mt-1">Track pending and completed deliveries</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Truck className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">Out for Delivery</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Delivered Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Address</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{d.id}</td>
                    <td className="py-3 px-4">{d.customer}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {d.address}
                      </div>
                    </td>
                    <td className="py-3 px-4">{d.items}</td>
                    <td className="py-3 px-4">{d.time}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-xs gap-1 ${getStatusStyle(d.status)}`}>
                        {getStatusIcon(d.status)}
                        {d.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
