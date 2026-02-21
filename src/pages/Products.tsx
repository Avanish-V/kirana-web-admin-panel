import { useState, useRef } from "react";
import { Plus, Search, Pencil, Trash2, Package, ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Tata Salt", category: "Grocery", price: 20, stock: 120, unit: "1kg" },
  { id: 2, name: "Amul Butter", category: "Dairy", price: 49, stock: 45, unit: "500g" },
  { id: 3, name: "Aashirvaad Atta", category: "Grocery", price: 290, stock: 30, unit: "5kg" },
  { id: 4, name: "Fortune Sunflower Oil", category: "Grocery", price: 159, stock: 22, unit: "1L" },
  { id: 5, name: "Parle-G Biscuits", category: "Snacks", price: 10, stock: 200, unit: "pack" },
  { id: 6, name: "Amul Milk", category: "Dairy", price: 28, stock: 60, unit: "500ml" },
  { id: 7, name: "Maggi Noodles", category: "Snacks", price: 14, stock: 150, unit: "pack" },
  { id: 8, name: "Surf Excel", category: "Household", price: 120, stock: 35, unit: "1kg" },
  { id: 9, name: "Red Label Tea", category: "Beverages", price: 180, stock: 40, unit: "500g" },
  { id: 10, name: "Vim Dishwash Bar", category: "Household", price: 10, stock: 80, unit: "piece" },
];

const categories = ["All", "Grocery", "Dairy", "Snacks", "Household", "Beverages"];

function getStockBadge(stock: number) {
  if (stock <= 10) return <Badge className="bg-destructive/15 text-destructive border-0 text-xs">Low</Badge>;
  if (stock <= 30) return <Badge className="bg-warning/15 text-warning border-0 text-xs">Medium</Badge>;
  return <Badge className="bg-success/15 text-success border-0 text-xs">In Stock</Badge>;
}

const emptyProduct = { name: "", category: "Grocery", price: 0, stock: 0, unit: "", image: "" };

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  }

  function openAdd() {
    setEditingProduct(null);
    setForm(emptyProduct);
    setImagePreview(null);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({ name: product.name, category: product.category, price: product.price, stock: product.stock, unit: product.unit, image: product.image || "" });
    setImagePreview(product.image || null);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.unit || form.price <= 0) {
      toast({ title: "Please fill all fields correctly", variant: "destructive" });
      return;
    }
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...form } : p)));
      toast({ title: "Product updated" });
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { id: newId, ...form }]);
      toast({ title: "Product added" });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Product deleted" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your store inventory</p>
        </div>
        <Button onClick={openAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-9 w-9 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><Badge variant="secondary" className="text-xs font-normal">{product.category}</Badge></td>
                    <td className="py-3 px-4 font-medium">₹{product.price}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">{getStockBadge(product.stock)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-xl object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors" />
                ) : (
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 flex flex-col items-center justify-center transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {imagePreview ? "Change image" : "Upload image"}
                  </p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tata Salt" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. 1kg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSave}>{editingProduct ? "Update" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
