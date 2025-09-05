import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CATEGORIES } from "@/data/categories";

interface ProductFilters {
  search: string;
  category: string;
  subcategory: string;
  status: string;
  priceMin: string;
  priceMax: string;
  stockMin: string;
}

interface AdminProductsFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
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

export function AdminProductsFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: AdminProductsFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof ProductFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.status) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.stockMin) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar y Filtrar Productos
          </CardTitle>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} activo{getActiveFiltersCount() > 1 ? 's' : ''}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda principal */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar productos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre, descripción o SKU..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => {
                updateFilter('category', value);
                updateFilter('subcategory', ''); // Reset subcategory when category changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todas las categorías</SelectItem>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subcategoría</Label>
            <Select 
              value={filters.subcategory} 
              onValueChange={(value) => updateFilter('subcategory', value)}
              disabled={!filters.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las subcategorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todas las subcategorías</SelectItem>
                {filters.category && CATEGORIES[filters.category as keyof typeof CATEGORIES]?.subcategories.map((sub) => (
                  <SelectItem key={sub.key} value={sub.key}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avanzados */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Ocultar' : 'Mostrar'} filtros avanzados
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Precio mínimo</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.priceMin}
                  onChange={(e) => updateFilter('priceMin', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Precio máximo</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="999.99"
                  value={filters.priceMax}
                  onChange={(e) => updateFilter('priceMax', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Stock mínimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.stockMin}
                  onChange={(e) => updateFilter('stockMin', e.target.value)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
