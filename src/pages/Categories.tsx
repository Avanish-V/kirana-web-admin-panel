import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Tags, ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  productCount: number;
  image?: string;
}

const initialCategories: Category[] = [
  { id: 1, name: "Grocery", productCount: 4 },
  { id: 2, name: "Dairy", productCount: 2 },
  { id: 3, name: "Snacks", productCount: 2 },
  { id: 4, name: "Household", productCount: 2 },
  { id: 5, name: "Beverages", productCount: 1 },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  }

  function openAdd() {
    setEditing(null);
    setName("");
    setImagePreview(null);
    setImageData("");
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setImagePreview(cat.image || null);
    setImageData(cat.image || "");
    setDialogOpen(true);
  }

  function handleSave() {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (editing) {
      setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name, image: imageData || c.image } : c)));
      toast({ title: "Category updated" });
    } else {
      const newId = Math.max(...categories.map((c) => c.id)) + 1;
      setCategories((prev) => [...prev, { id: newId, name, productCount: 0, image: imageData }]);
      toast({ title: "Category added" });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Category deleted" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize your products</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Tags className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Category Image</Label>
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
              <Label>Category Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fruits & Vegetables" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
