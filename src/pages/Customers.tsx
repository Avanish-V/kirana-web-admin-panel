import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Eye, Users, UserCheck, IndianRupee, ShoppingCart, Phone, MapPin } from "lucide-react";

interface OrderSummary {
  id: string;
  date: string;
  total: number;
  status: string;
  payment: "COD" | "Online";
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  orders: OrderSummary[];
}

const customers: Customer[] = [
  {
    id: "C-001", name: "Ramesh Kumar", phone: "+91 98765 43210", address: "12, MG Road, Sector 5",
    totalOrders: 14, totalSpent: 4870, lastOrder: "2026-02-23",
    orders: [
      { id: "ORD-1024", date: "2026-02-23", total: 407, status: "Delivered", payment: "Online" },
      { id: "ORD-1010", date: "2026-02-15", total: 620, status: "Delivered", payment: "COD" },
      { id: "ORD-1001", date: "2026-02-08", total: 315, status: "Delivered", payment: "Online" },
    ],
  },
  {
    id: "C-002", name: "Priya Sharma", phone: "+91 91234 56789", address: "45, Nehru Nagar",
    totalOrders: 8, totalSpent: 3200, lastOrder: "2026-02-23",
    orders: [
      { id: "ORD-1023", date: "2026-02-23", total: 530, status: "Pending", payment: "COD" },
      { id: "ORD-1008", date: "2026-02-12", total: 890, status: "Delivered", payment: "Online" },
    ],
  },
  {
    id: "C-003", name: "Amit Patel", phone: "+91 87654 32100", address: "78, Gandhi Chowk",
    totalOrders: 22, totalSpent: 12450, lastOrder: "2026-02-22",
    orders: [
      { id: "ORD-1022", date: "2026-02-22", total: 962, status: "Confirmed", payment: "Online" },
      { id: "ORD-1015", date: "2026-02-18", total: 1200, status: "Delivered", payment: "COD" },
      { id: "ORD-1005", date: "2026-02-10", total: 450, status: "Delivered", payment: "Online" },
    ],
  },
  {
    id: "C-004", name: "Sunita Devi", phone: "+91 99887 76655", address: "23, Station Road",
    totalOrders: 5, totalSpent: 1540, lastOrder: "2026-02-22",
    orders: [
      { id: "ORD-1021", date: "2026-02-22", total: 104, status: "Out for Delivery", payment: "COD" },
      { id: "ORD-1009", date: "2026-02-14", total: 380, status: "Delivered", payment: "COD" },
    ],
  },
  {
    id: "C-005", name: "Vikram Singh", phone: "+91 77665 54433", address: "56, Civil Lines",
    totalOrders: 11, totalSpent: 5680, lastOrder: "2026-02-21",
    orders: [
      { id: "ORD-1020", date: "2026-02-21", total: 221, status: "Pending", payment: "Online" },
      { id: "ORD-1012", date: "2026-02-16", total: 755, status: "Delivered", payment: "Online" },
    ],
  },
  {
    id: "C-006", name: "Meena Kumari", phone: "+91 88776 65544", address: "9, Rajiv Colony",
    totalOrders: 3, totalSpent: 1780, lastOrder: "2026-02-21",
    orders: [
      { id: "ORD-1019", date: "2026-02-21", total: 590, status: "Cancelled", payment: "COD" },
    ],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Pending": return "bg-warning/15 text-warning border-0";
    case "Confirmed": return "bg-info/15 text-info border-0";
    case "Out for Delivery": return "bg-primary/15 text-primary border-0";
    case "Delivered": return "bg-success/15 text-success border-0";
    case "Cancelled": return "bg-destructive/15 text-destructive border-0";
    default: return "";
  }
}

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active This Week", value: customers.filter((c) => c.lastOrder >= "2026-02-20").length, icon: UserCheck, color: "text-success", bg: "bg-success/10" },
    { label: "Total Revenue", value: `₹${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", value: customers.reduce((s, c) => s + c.totalOrders, 0), icon: ShoppingCart, color: "text-info", bg: "bg-info/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">View customer profiles and order history.</p>
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

      {/* Customer List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-semibold">All Customers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-full sm:w-[240px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Phone</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Orders</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Total Spent</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Last Order</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No customers found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.id}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                      <TableCell>{c.totalOrders}</TableCell>
                      <TableCell className="font-medium">₹{c.totalSpent.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-muted-foreground">{c.lastOrder}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCustomer(c)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No customers found.</p>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.id}</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-0">
                      {c.totalOrders} orders
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>
                    <span className="font-bold">₹{c.totalSpent.toLocaleString("en-IN")}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs w-full" onClick={() => setSelectedCustomer(c)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>{selectedCustomer?.id}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-5">
              {/* Profile Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Phone</p>
                  <p className="font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Total Spent</p>
                  <p className="font-bold text-primary">₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Address</p>
                  <p className="font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{selectedCustomer.address}</p>
                </div>
              </div>

              {/* Summary badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-0">{selectedCustomer.totalOrders} total orders</Badge>
                <Badge variant="outline" className="text-xs bg-muted border-0">Last: {selectedCustomer.lastOrder}</Badge>
              </div>

              {/* Order History */}
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Recent Orders</p>
                <div className="rounded-lg border divide-y">
                  {selectedCustomer.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-3 py-2.5 text-sm">
                      <div>
                        <p className="font-medium">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date} · {o.payment}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₹{o.total.toLocaleString("en-IN")}</span>
                        <Badge variant="outline" className={`text-[10px] ${getStatusColor(o.status)}`}>{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
