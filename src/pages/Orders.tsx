import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Eye, ShoppingCart, IndianRupee, Clock, CheckCircle2, Wallet, Banknote } from "lucide-react";

type OrderStatus = "Pending" | "Confirmed" | "Out for Delivery" | "Delivered" | "Cancelled";
type PaymentMethod = "COD" | "Online";

interface OrderItem { name: string; qty: number; price: number; }

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  payment: PaymentMethod;
}

const statusFlow: OrderStatus[] = ["Pending", "Confirmed", "Out for Delivery", "Delivered"];

const initialOrders: Order[] = [
  { id: "ORD-1024", customer: "Ramesh Kumar", phone: "+91 98765 43210", address: "12, MG Road, Sector 5", items: [{ name: "Tata Salt (1kg)", qty: 2, price: 20 }, { name: "Amul Butter (500g)", qty: 1, price: 49 }, { name: "Fortune Oil (1L)", qty: 2, price: 159 }], total: 407, status: "Delivered", date: "2026-02-23", payment: "Online" },
  { id: "ORD-1023", customer: "Priya Sharma", phone: "+91 91234 56789", address: "45, Nehru Nagar", items: [{ name: "Aashirvaad Atta (5kg)", qty: 1, price: 290 }, { name: "Parle-G (800g)", qty: 3, price: 80 }], total: 530, status: "Pending", date: "2026-02-23", payment: "COD" },
  { id: "ORD-1022", customer: "Amit Patel", phone: "+91 87654 32100", address: "78, Gandhi Chowk", items: [{ name: "Maggi Noodles (Pack of 12)", qty: 2, price: 144 }, { name: "Brooke Bond Tea (500g)", qty: 1, price: 235 }, { name: "Surf Excel (1kg)", qty: 1, price: 199 }, { name: "Amul Milk (1L)", qty: 4, price: 60 }], total: 962, status: "Confirmed", date: "2026-02-22", payment: "Online" },
  { id: "ORD-1021", customer: "Sunita Devi", phone: "+91 99887 76655", address: "23, Station Road", items: [{ name: "Sugar (1kg)", qty: 2, price: 42 }, { name: "Tata Salt (1kg)", qty: 1, price: 20 }], total: 104, status: "Out for Delivery", date: "2026-02-22", payment: "COD" },
  { id: "ORD-1020", customer: "Vikram Singh", phone: "+91 77665 54433", address: "56, Civil Lines", items: [{ name: "Amul Butter (500g)", qty: 2, price: 49 }, { name: "Britannia Bread", qty: 1, price: 45 }, { name: "Eggs (12 pack)", qty: 1, price: 78 }], total: 221, status: "Pending", date: "2026-02-21", payment: "Online" },
  { id: "ORD-1019", customer: "Meena Kumari", phone: "+91 88776 65544", address: "9, Rajiv Colony", items: [{ name: "Rice (5kg)", qty: 1, price: 350 }, { name: "Dal (1kg)", qty: 2, price: 120 }], total: 590, status: "Cancelled", date: "2026-02-21", payment: "COD" },
];

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "Pending": return "bg-warning/15 text-warning border-0";
    case "Confirmed": return "bg-info/15 text-info border-0";
    case "Out for Delivery": return "bg-primary/15 text-primary border-0";
    case "Delivered": return "bg-success/15 text-success border-0";
    case "Cancelled": return "bg-destructive/15 text-destructive border-0";
    default: return "";
  }
}

function getPaymentBadge(payment: PaymentMethod) {
  if (payment === "COD") {
    return (
      <Badge variant="outline" className="text-xs gap-1 bg-accent/50 border-0">
        <Banknote className="h-3 w-3" /> COD
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs gap-1 bg-success/10 text-success border-0">
      <Wallet className="h-3 w-3" /> Online
    </Badge>
  );
}

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = statusFlow.indexOf(current);
  if (idx === -1 || idx >= statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: orders.filter((o) => o.status === "Pending").length, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Revenue", value: `₹${orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage customer orders.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <p className="text-xl font-bold mt-0.5">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-semibold">All Orders</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-full sm:w-[200px]" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Order ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Customer</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Items</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Total</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Payment</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No orders found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((order) => {
                    const next = getNextStatus(order.status);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell className="font-medium">₹{order.total.toLocaleString("en-IN")}</TableCell>
                        <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></Button>
                            {next && (<Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => updateStatus(order.id, next)}>→ {next}</Button>)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders found.</p>
            ) : (
              filtered.map((order) => {
                const next = getNextStatus(order.status);
                return (
                  <div key={order.id} className="rounded-xl border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{order.customer}</span>
                      <span className="font-bold">₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                      {getPaymentBadge(order.payment)}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      {next && (
                        <Button size="sm" className="h-8 text-xs flex-1" onClick={() => updateStatus(order.id, next)}>→ {next}</Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>{selectedOrder?.date} · {selectedOrder?.customer}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Phone</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Status</p>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Payment</p>
                  {getPaymentBadge(selectedOrder.payment)}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Address</p>
                  <p className="font-medium text-xs">{selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Items</p>
                <div className="rounded-lg border divide-y">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{item.name} <span className="text-muted-foreground">× {item.qty}</span></span>
                      <span className="font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-bold bg-muted/30">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {getNextStatus(selectedOrder.status) && (
                <Button className="w-full" onClick={() => updateStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!)}>
                  Move to {getNextStatus(selectedOrder.status)}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
