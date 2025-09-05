import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, History } from "lucide-react";
import { useUsdRate } from "@/hooks/use-usd-rate";
import { useToast } from "@/hooks/use-toast";

export function AdminUsdRate() {
  const { currentRate, rateHistory, isLoading, updateRate, fetchRateHistory } = useUsdRate();
  const { toast } = useToast();
  const [newRate, setNewRate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rate = parseFloat(newRate);
    if (!rate || rate <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una tasa válida mayor a 0",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    const success = await updateRate(rate, 'Admin');
    
    if (success) {
      toast({
        title: "Tasa actualizada",
        description: `Nueva tasa: Bs. ${rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} por $1 USD`,
      });
      setNewRate("");
      fetchRateHistory();
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar la tasa",
        variant: "destructive",
      });
    }
    
    setIsUpdating(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando información de tasa...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Tasa Actual USD → Bs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-3xl font-bold text-primary">
                Bs. {currentRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Por cada $1 USD</div>
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              Vigente
            </Badge>
          </div>
          
          <form onSubmit={handleUpdateRate} className="space-y-4">
            <div>
              <Label htmlFor="newRate">Nueva Tasa (Bs por $1 USD)</Label>
              <Input
                id="newRate"
                type="number"
                step="0.01"
                min="0"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Ej: 150.50"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? "Actualizando..." : "Actualizar Tasa"}
            </Button>
          </form>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Al actualizar la tasa, todos los precios en bolívares se 
              recalcularán automáticamente en la tienda y en el carrito de compras.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rate History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Tasas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rateHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay historial de tasas disponible
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tasa (Bs/$)</TableHead>
                  <TableHead>Establecida por</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">
                      Bs. {Number(record.rate).toLocaleString('es-VE', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell>{record.set_by || 'Sistema'}</TableCell>
                    <TableCell>
                      {new Date(record.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {record.is_current ? (
                        <Badge className="bg-green-500">Vigente</Badge>
                      ) : (
                        <Badge variant="secondary">Histórica</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}