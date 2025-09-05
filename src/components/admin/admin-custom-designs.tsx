import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useCustomDesigns, CustomDesign } from "@/hooks/use-custom-designs";
import { useToast } from "@/hooks/use-toast";

export function AdminCustomDesigns() {
  const { designs, isLoading, fetchDesigns, createDesign, updateDesign, deleteDesign } = useCustomDesigns();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<CustomDesign | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      display_order: 0,
      status: 'active'
    });
    setEditingDesign(null);
  };

  const handleEdit = (design: CustomDesign) => {
    setEditingDesign(design);
    setFormData({
      title: design.title,
      description: design.description || '',
      image_url: design.image_url || '',
      display_order: design.display_order,
      status: design.status as 'active' | 'inactive'
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    let success = false;
    if (editingDesign) {
      success = await updateDesign(editingDesign.id, formData);
    } else {
      success = await createDesign(formData);
    }

    if (success) {
      toast({
        title: "Éxito",
        description: editingDesign ? "Diseño actualizado exitosamente" : "Diseño creado exitosamente",
      });
      setIsDialogOpen(false);
      resetForm();
      fetchDesigns(true);
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar el diseño",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) return;
    
    const success = await deleteDesign(id);
    if (success) {
      toast({
        title: "Diseño eliminado",
        description: "El diseño ha sido eliminado exitosamente",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el diseño",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando diseños...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mockups de Diseño</h2>
          <p className="text-muted-foreground">
            Gestiona los diseños mostrados en la página de pedidos personalizados
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Diseño
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDesign ? 'Editar Diseño' : 'Nuevo Diseño'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Uniformes Empresariales Exclusivos"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descripción del tipo de diseño..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Opcional: Deja vacío para mostrar placeholder por defecto
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Orden de Visualización</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full h-9 px-3 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingDesign ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <Card key={design.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gold-light/20 via-beige to-gold/10 relative">
              {design.image_url ? (
                <img 
                  src={design.image_url} 
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute top-2 right-2">
                <Badge variant={design.status === 'active' ? 'default' : 'secondary'}>
                  {design.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm leading-tight">
                  {design.title}
                </h3>
                <Badge variant="outline" className="text-xs">
                  #{design.display_order}
                </Badge>
              </div>
              
              {design.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {design.description}
                </p>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(design)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(design.id, design.title)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {designs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay diseños creados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer diseño mockup para mostrar en la página de pedidos personalizados
            </p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Diseño
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}