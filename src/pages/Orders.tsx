import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Eye, ShoppingCart, IndianRupee, Clock, CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

type OrderStatus = "Pending" | "Confirmed" | "Out for Delivery" | "Delivered" | "Cancelled" | "Paid" | "Placed" | "Failed";

interface OrderItem {
  id?: number;
  productId?: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const statusFlow: string[] = ["PENDING", "PLACED", "PAID", "DELIVERED"];

function getStatusColor(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "PENDING":
      return "bg-warning/15 text-warning border-0";
    case "PLACED":
    case "CONFIRMED":
      return "bg-info/15 text-info border-0";
    case "PAID":
      return "bg-primary/15 text-primary border-0";
    case "OUT FOR DELIVERY":
      return "bg-primary/15 text-primary border-0";
    case "DELIVERED":
      return "bg-success/15 text-success border-0";
    case "CANCELLED":
    case "FAILED":
      return "bg-destructive/15 text-destructive border-0";
    default:
      return "bg-muted text-muted-foreground border-0";
  }
}

function getNextStatus(current: string): string | null {
  const s = current.toUpperCase();
  const idx = statusFlow.indexOf(s);
  if (idx === -1 || idx >= statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders from server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toString().includes(search) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone?.includes(search);
    const matchStatus = filterStatus === "all" || o.status.toUpperCase() === filterStatus.toUpperCase();
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      // Refresh only the updated order or all orders
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status.",
      });
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status.toUpperCase() === "PENDING").length,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status.toUpperCase() === "DELIVERED").length,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Revenue",
      value: `₹${orders.filter((o) => o.status.toUpperCase() !== "CANCELLED" && o.status.toUpperCase() !== "FAILED").reduce((s, o) => s + o.totalAmount, 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage customer orders.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </p>
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
                <Input
                  placeholder="ID, Customer, Phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-full sm:w-[220px]"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PLACED">Placed</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Order ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Customer</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Items</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Total</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((order) => {
                        const next = getNextStatus(order.status);
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{order.customerName || "Unknown"}</span>
                                <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{formatDate(order.createdAt)}</TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell className="font-medium">₹{order.totalAmount.toLocaleString("en-IN")}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] px-2 py-0 h-5 font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {next && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-[10px] px-2"
                                    onClick={() => updateStatus(order.id, next)}
                                  >
                                    → {next}
                                  </Button>
                                )}
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
                      <div
                        key={order.id}
                        className="rounded-xl border bg-card p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">#{order.id}</p>
                            <p className="text-[10px] text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerName || "Unknown"}</span>
                            <span className="text-[10px] text-muted-foreground">{order.customerPhone}</span>
                          </div>
                          <span className="font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs flex-1"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                          {next && (
                            <Button
                              size="sm"
                              className="h-8 text-xs flex-1"
                              onClick={() => updateStatus(order.id, next)}
                            >
                              → {next}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder && formatDate(selectedOrder.createdAt)} · {selectedOrder?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Status</p>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Address</p>
                  <p className="font-medium text-xs leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Payment</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-2">Items</p>
                <div className="rounded-lg border divide-y overflow-hidden">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="h-8 w-8 rounded object-cover border" />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{item.productName}</span>
                          <span className="text-[10px] text-muted-foreground">₹{item.price} × {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2.5 text-sm font-bold bg-muted/30">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {getNextStatus(selectedOrder.status) && (
                <Button
                  className="w-full h-10 shadow-lg shadow-primary/20"
                  onClick={() => updateStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                >
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
