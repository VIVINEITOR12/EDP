import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const categories = {
  "mujeres": {
    name: "Mujeres",
    subcategories: ["vestidos", "blusas", "pantalones", "faldas", "conjuntos", "crop-tops"]
  },
  "hombres": {
    name: "Hombres", 
    subcategories: ["camisas", "pantalones", "sueteres", "franelas", "shorts"]
  },
  "ninos": {
    name: "Niños",
    subcategories: ["camisas", "pantalones", "conjuntos", "ropa-escolar"]
  },
  "ninas": {
    name: "Niñas",
    subcategories: ["blusas", "faldas", "vestidos", "conjuntos", "ropa-escolar"]
  }
};

export function AdminProductEditDialog({ product, open, onOpenChange, onSave }: AdminProductEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    subcategory: "",
    status: "active",
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as File[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        price: String(product.price || ""),
        stock: String(product.stock || ""),
        description: product.description || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        status: product.status || "active",
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: []
      });
    }
  }, [product]);

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

  const handleSave = async () => {
    if (!product) return;

    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios (Nombre, Categoría, Precio)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrls: string[] = [];
      if (formData.images && formData.images.length > 0) {
        imageUrls = await uploadImages(formData.images);
      }

      const updateData: any = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        sku: formData.sku || null,
        stock: parseInt(formData.stock) || 0,
        status: formData.status,
        sizes: formData.sizes.length > 0 ? formData.sizes : null,
        colors: formData.colors.length > 0 ? formData.colors : null,
      };

      // Only update images if new ones were uploaded
      if (imageUrls.length > 0) {
        updateData.images = imageUrls;
        updateData.image = imageUrls[0]; // Keep backward compatibility
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente",
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Producto *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nombre del producto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="Código del producto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value, subcategory: ""})}>
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
              <Label htmlFor="edit-subcategory">Subcategoría</Label>
                <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value === "none" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin subcategoría</SelectItem>
                    {formData.category && categories[formData.category as keyof typeof categories]?.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub} className="capitalize">{sub.replace('-', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sizes">Tallas (separadas por coma)</Label>
              <Input
                id="edit-sizes"
                value={formData.sizes.join(', ')}
                onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="S, M, L, XL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-colors">Colores (separados por coma)</Label>
              <Input
                id="edit-colors"
                value={formData.colors.join(', ')}
                onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="Rojo, Azul, Negro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-images">Nuevas Imágenes (opcional)</Label>
            <Input
              id="edit-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFormData({...formData, images: e.target.files ? Array.from(e.target.files) : []})}
            />
            {formData.images.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {formData.images.length} imagen(es) seleccionada(s)
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
