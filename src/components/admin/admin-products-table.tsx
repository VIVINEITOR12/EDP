import { useState } from "react";
import { Product } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/price-utils";

interface AdminProductsTableProps {
  products: Product[];
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onMove: (productId: string, direction: 'up' | 'down') => void;
  onQuickEdit: (productId: string, field: string, value: any) => void;
}

const categories = {
  "mujeres": "Mujeres",
  "hombres": "Hombres", 
  "ninos": "Niños",
  "ninas": "Niñas"
};

export function AdminProductsTable({
  products,
  searchTerm,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onMove,
  onQuickEdit
}: AdminProductsTableProps) {
  const [editingCell, setEditingCell] = useState<{productId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCellEdit = (productId: string, field: string, currentValue: any) => {
    setEditingCell({ productId, field });
    setEditValue(String(currentValue || ""));
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    let value: any = editValue;
    if (editingCell.field === 'price' || editingCell.field === 'stock') {
      value = parseFloat(editValue) || 0;
    }
    
    onQuickEdit(editingCell.productId, editingCell.field, value);
    setEditingCell(null);
    setEditValue("");
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Imagen</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-2">
                Nombre {renderSortIcon('name')}
              </div>
            </TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('price')}
            >
              <div className="flex items-center gap-2">
                Precio {renderSortIcon('price')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('stock')}
            >
              <div className="flex items-center gap-2">
                Stock {renderSortIcon('stock')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center gap-2">
                Estado {renderSortIcon('status')}
              </div>
            </TableHead>
            <TableHead className="w-32">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                {(product.images?.[0] || product.image) && (
                  <img 
                    src={product.images?.[0] || product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </TableCell>
              
              <TableCell className="font-medium min-w-[200px]">
                {product.name}
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">
                    {categories[product.category as keyof typeof categories]}
                  </div>
                  {product.subcategory && (
                    <div className="text-muted-foreground capitalize">
                      {product.subcategory.replace('-', ' ')}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                {editingCell?.productId === product.id && editingCell?.field === 'sku' ? (
                  <div className="flex gap-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-24"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCellSave();
                        if (e.key === 'Escape') handleCellCancel();
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                    onClick={() => handleCellEdit(product.id, 'sku', product.sku)}
                  >
                    {product.sku || '-'}
                  </div>
                )}
              </TableCell>
              
              <TableCell>
                {editingCell?.productId === product.id && editingCell?.field === 'price' ? (
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCellSave();
                        if (e.key === 'Escape') handleCellCancel();
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                    onClick={() => handleCellEdit(product.id, 'price', product.price)}
                  >
                    {formatPrice(product.price)}
                  </div>
                )}
              </TableCell>
              
              <TableCell>
                {editingCell?.productId === product.id && editingCell?.field === 'stock' ? (
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-16"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCellSave();
                        if (e.key === 'Escape') handleCellCancel();
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                    onClick={() => handleCellEdit(product.id, 'stock', product.stock)}
                  >
                    {product.stock || 0}
                  </div>
                )}
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    "cursor-pointer",
                    product.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                  )}
                  onClick={() => onQuickEdit(product.id, 'status', product.status === 'active' ? 'inactive' : 'active')}
                >
                  {product.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMove(product.id, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMove(product.id, 'down')}
                    disabled={index === products.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}