import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminProductsFilters } from "./admin-products-filters";
import { AdminProductsTable } from "./admin-products-table";
import { AdminProductEditDialog } from "./admin-product-edit-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/hooks/use-products";

interface ProductFilters {
  search: string;
  category: string;
  subcategory: string;
  status: string;
  priceMin: string;
  priceMax: string;
  stockMin: string;
}

interface EditingProduct extends Product {
  newImages?: File[];
}

const categories = {
  "mujeres": {
    name: "Mujeres",
    subcategories: ["casual", "vestidos", "pantalones", "chaquetas", "sport", "interior", "baño", "formal"]
  },
  "hombres": {
    name: "Hombres", 
    subcategories: ["camisas", "pantalones", "chaquetas", "conjuntos", "polos", "sport", "baño", "formal"]
  },
  "ninos": {
    name: "Niños",
    subcategories: ["camisas", "pantalones", "uniformes", "conjuntos", "sport", "temporada"]
  },
  "ninas": {
    name: "Niñas",
    subcategories: ["vestidos", "blusas", "conjuntos", "escolar", "sport", "baño", "accesorios"]
  }
};

const initialFilters: ProductFilters = {
  search: "",
  category: "",
  subcategory: "",
  status: "",
  priceMin: "",
  priceMax: "",
  stockMin: ""
};

export function AdminProductsEnhanced() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("display_order");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    sku: "",
    stock: "",
    status: "active",
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as File[]
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

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description?.toLowerCase().includes(searchLower);
        const matchesSku = product.sku?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesDescription && !matchesSku) {
          return false;
        }
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Subcategory filter
      if (filters.subcategory && product.subcategory !== filters.subcategory) {
        return false;
      }

      // Status filter
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Price range filter
      const productPrice = typeof product.price === 'object' ? product.price.usd : product.price;
      if (filters.priceMin && productPrice < parseFloat(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && productPrice > parseFloat(filters.priceMax)) {
        return false;
      }

      // Stock filter
      if (filters.stockMin && product.stock < parseInt(filters.stockMin)) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product];
      let bValue: any = b[sortBy as keyof Product];

      // Handle string values
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, filters, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls = [];
    
    for (const file of files) {
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

        urls.push(data.publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Error al subir una imagen",
          variant: "destructive",
        });
      }
    }
    
    return urls;
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
      let imageUrls: string[] = [];
      if (newProduct.images && newProduct.images.length > 0) {
        imageUrls = await uploadImages(newProduct.images);
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
          sku: newProduct.sku || null,
          stock: parseInt(newProduct.stock) || 0,
          status: newProduct.status,
          sizes: newProduct.sizes.length > 0 ? newProduct.sizes : null,
          colors: newProduct.colors.length > 0 ? newProduct.colors : null,
          images: imageUrls.length > 0 ? imageUrls : null,
          image: imageUrls[0] || null, // Keep backward compatibility
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
        sku: "",
        stock: "",
        status: "active",
        sizes: [],
        colors: [],
        images: []
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

  const handleQuickEdit = async (productId: string, field: string, value: any) => {
    try {
      const updateData: any = { [field]: value };
      
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Producto actualizado",
        description: "El cambio se ha guardado exitosamente",
      });

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
    const currentIndex = filteredAndSortedProducts.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= filteredAndSortedProducts.length) return;

    const updatedProducts = [...filteredAndSortedProducts];
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

      toast({
        title: "Orden actualizado",
        description: "El orden de los productos se ha actualizado",
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error updating product order:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el orden",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'grid')}>
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                Tabla
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Tarjetas
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      placeholder="Código del producto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={newProduct.status} onValueChange={(value) => setNewProduct({...newProduct, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* No se necesita un SelectItem con value="" aquí si solo hay opciones específicas */}
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value === "none" ? "" : value, subcategory: ""})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Selecciona categoría</SelectItem>
                        {Object.entries(categories).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategoría</Label>
                    <Select value={newProduct.subcategory} onValueChange={(value) => setNewProduct({...newProduct, subcategory: value === "none" ? "" : value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin subcategoría</SelectItem>
                        {newProduct.category && categories[newProduct.category as keyof typeof categories]?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub} className="capitalize">{sub.replace('-', ' ')}</SelectItem>
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
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Tallas (separadas por coma)</Label>
                    <Input
                      id="sizes"
                      value={newProduct.sizes.join(', ')}
                      onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colores (separados por coma)</Label>
                    <Input
                      id="colors"
                      value={newProduct.colors.join(', ')}
                      onChange={(e) => setNewProduct({...newProduct, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      placeholder="Rojo, Azul, Negro"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Imágenes (múltiples)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewProduct({...newProduct, images: e.target.files ? Array.from(e.target.files) : []})}
                  />
                  {newProduct.images.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {newProduct.images.length} imagen(es) seleccionada(s)
                    </div>
                  )}
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
      </div>

      {/* Filters */}
      <AdminProductsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filteredAndSortedProducts.length} de {products.length} productos
        </span>
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        <AdminProductsTable
          products={filteredAndSortedProducts}
          searchTerm={filters.search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteProduct}
          onMove={moveProduct}
          onQuickEdit={handleQuickEdit}
        />
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {(product.images?.[0] || product.image) && (
                      <img src={product.images?.[0] || product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categories[product.category as keyof typeof categories]?.name} - ${typeof product.price === 'object' ? product.price.usd : product.price}
                      </p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <AdminProductEditDialog
        product={editingProduct}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={() => {
          fetchProducts();
          setEditingProduct(null);
        }}
      />
    </div>
  );
}
