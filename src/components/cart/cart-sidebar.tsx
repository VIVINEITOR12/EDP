import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./cart-context";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";

import { useUsdRate } from "@/hooks/use-usd-rate";
import { getPriceAsNumber, formatPrice } from "@/utils/price-utils";

export function CartSidebar() {
  const { state, dispatch } = useCart();
  const { currentRate: rate, isLoading: rateLoading } = useUsdRate();

  const totalUSD = state.items.reduce((sum, item) => sum + getPriceAsNumber(item.price) * item.quantity, 0);
  const totalBS = totalUSD * rate;

  const getVariant = (item: any) => ({
    id: item.id,
    size: item.selectedSize || item.size,
    color: item.selectedColor || item.color,
  });

  const getVariantKey = (item: any) => {
    const v = getVariant(item);
    return `${v.id}-${v.size || "nosize"}-${v.color || "nocolor"}`;
  };

  const sizeLabel = (item: any) => item.selectedSize || item.size;
  const colorLabel = (item: any) => item.selectedColor || item.color;

  const handleSendToWhatsApp = () => {
    const items = state.items
      .map((item) => {
        const size = sizeLabel(item);
        const color = colorLabel(item);
        const lineTotal = (getPriceAsNumber(item.price) * item.quantity).toFixed(2);
        return `${item.quantity}x ${item.name}${size ? ` (Talla: ${size})` : ""}${color ? ` (Color: ${color})` : ""} - $${lineTotal}`;
      })
      .join("\n");

    const message = `Hola, quiero hacer el siguiente pedido:\n\n${items}\n\nTotal: $${totalUSD.toFixed(2)} USD (Bs. ${totalBS.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n\n¿Podrían confirmar disponibilidad y método de pago?`;

    const whatsappUrl = `https://wa.me/584249539367?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => dispatch({ type: "SET_CART_OPEN", payload: open })}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Carrito de Compras
            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {state.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-sm">¡Explora nuestro catálogo y encuentra algo especial!</p>
            </div>
            <Button className="mt-4" onClick={() => dispatch({ type: "SET_CART_OPEN", payload: false })}>
              Ir al Catálogo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {state.items.map((item) => {
                const size = sizeLabel(item);
                const color = colorLabel(item);
                return (
                  <div key={getVariantKey(item)} className="bg-card rounded-lg p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                        {size && <p className="text-sm text-muted-foreground">Talla: {size}</p>}
                        {color && <p className="text-sm text-muted-foreground">Color: {color}</p>}
                        <p className="text-gold font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_ITEM",
                            payload: { id: item.id, size, color },
                          })
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { id: item.id, size, color, quantity: item.quantity - 1 },
                            })
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { id: item.id, size, color, quantity: item.quantity + 1 },
                            })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${(getPriceAsNumber(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total USD:</span>
                  <span className="text-gold">${totalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Bs:</span>
                  <span className="text-gold">
                    {rateLoading ? "Calculando..." : `Bs. ${totalBS.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tasa USD→Bs:</span>
                    <span>
                      {rateLoading ? "Cargando..." : `Bs. ${rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $1`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tasa configurada manualmente por el administrador
                  </div>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-2">
                <Button onClick={handleSendToWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Pedido por WhatsApp
                </Button>

                <Button variant="outline" onClick={() => dispatch({ type: "CLEAR_CART" })} className="w-full" size="sm">
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
