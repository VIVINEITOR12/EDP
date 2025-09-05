import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ChevronUp, ChevronDown, Upload, Table as TableIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminProductsFilters } from "./admin-products-filters";
import { AdminProductsTable } from "./admin-products-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  description?: string;
  image?: string;
  images?: string[];
  rating: number;
  display_order: number;
  stock: number;
  status: string;
  sku?: string;
  sizes?: string[];
  colors?: string[];
}

interface EditingProduct extends Product {
  newImages?: File[];
}

const categories = {
  "mujeres": {
    name: "Mujeres",
    subcategories: ["vestidos", "blusas", "pantalones", "faldas", "conjuntos"]
  },
  "hombres": {
    name: "Hombres", 
    subcategories: ["camisas", "pantalones", "chaquetas", "conjuntos"]
  },
  "ninos": {
    name: "Niños",
    subcategories: ["ropa-casual", "uniformes", "conjuntos"]
  },
  "ninas": {
    name: "Niñas",
    subcategories: ["vestidos", "blusas", "faldas", "conjuntos"]
  }
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    image: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Error al cargar los productos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;
      if (newProduct.image) {
        imageUrl = await uploadImage(newProduct.image);
        if (!imageUrl) return;
      }

      const maxOrder = Math.max(...products.map(p => p.display_order || 0), 0);

      const { error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          category: newProduct.category,
          subcategory: newProduct.subcategory || null,
          price: parseFloat(newProduct.price),
          description: newProduct.description || null,
          image: imageUrl,
          display_order: maxOrder + 1
        }]);

      if (error) throw error;

      toast({
        title: "Producto agregado",
        description: "El producto se ha agregado exitosamente",
      });

      setNewProduct({
        name: "",
        category: "",
        subcategory: "",
        price: "",
        description: "",
        image: null
      });
      setIsAddDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Error al agregar el producto",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      let imageUrl = product.image;
      
      // Handle image update if new files are selected
      if (editingProduct && editingProduct.newImages && editingProduct.newImages.length > 0) {
        const uploadedImageUrl = await uploadImage(editingProduct.newImages[0]);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          category: product.category,
          subcategory: product.subcategory || null,
          price: product.price,
          description: product.description || null,
          image: imageUrl,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente",
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= products.length) return;

    const updatedProducts = [...products];
    [updatedProducts[currentIndex], updatedProducts[newIndex]] = 
    [updatedProducts[newIndex], updatedProducts[currentIndex]];

    try {
      const updates = updatedProducts.map((product, index) => ({
        id: product.id,
        display_order: index
      }));

      for (const update of updates) {
        await supabase
          .from('products')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setProducts(updatedProducts);
      toast({
        title: "Orden actualizado",
        description: "El orden de los productos se ha actualizado",
      });
    } catch (error) {
      console.error('Error updating product order:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el orden",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value, subcategory: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, cat]) => (
                        <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategoría</Label>
                  <Select value={newProduct.subcategory} onValueChange={(value) => setNewProduct({...newProduct, subcategory: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {newProduct.category && categories[newProduct.category as keyof typeof categories]?.subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagen</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.files?.[0] || null})}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="flex-1">
                  Agregar Producto
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product, index) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              {editingProduct?.id === product.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select 
                        value={editingProduct.category} 
                        onValueChange={(value) => setEditingProduct({...editingProduct, category: value, subcategory: undefined})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categories).map(([key, cat]) => (
                            <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subcategoría</Label>
                      <Select 
                        value={editingProduct.subcategory || ""} 
                        onValueChange={(value) => setEditingProduct({...editingProduct, subcategory: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona subcategoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {editingProduct.category && categories[editingProduct.category as keyof typeof categories]?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nueva Imagen (opcional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingProduct({...editingProduct, newImages: e.target.files ? Array.from(e.target.files) : []})}
                    />
                    {editingProduct.image && (
                      <div className="mt-2">
                        <img src={editingProduct.image} alt="Imagen actual" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateProduct(editingProduct)}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categories[product.category as keyof typeof categories]?.name} - ${product.price}
                      </p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveProduct(product.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveProduct(product.id, 'down')}
                        disabled={index === products.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct({...product, newImages: []})}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hay productos creados</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar tu primer producto
          </Button>
        </div>
      )}
    </div>
  );
}