import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number | { usd: number; bs: number };
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number; size?: string; color?: string } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean };

const STORAGE_KEY = "cartState_v1";

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const isSameVariant = (a: CartItem, b: { id: string; size?: string; color?: string }) => {
  const aSize = a.selectedSize || a.size;
  const aColor = a.selectedColor || a.color;
  const bSize = b.size;
  const bColor = b.color;
  return a.id === b.id && (aSize || "") === (bSize || "") && (aColor || "") === (bColor || "");
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item =>
        isSameVariant(item, {
          id: action.payload.id,
          size: action.payload.selectedSize || action.payload.size,
          color: action.payload.selectedColor || action.payload.color,
        })
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            isSameVariant(item, {
              id: action.payload.id,
              size: action.payload.selectedSize || action.payload.size,
              color: action.payload.selectedColor || action.payload.color,
            })
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(item => !isSameVariant(item, action.payload)),
      };
    }

    case "UPDATE_QUANTITY": {
      return {
        ...state,
        items: state.items
          .map(item =>
            isSameVariant(item, action.payload)
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter(item => item.quantity > 0),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      };

    default:
      return state;
  }
};

function loadInitialState(): CartState {
  if (typeof window === "undefined") {
    return { items: [], isOpen: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], isOpen: false };
    const parsed = JSON.parse(raw) as CartState;
    // Evitar abrir el sidebar automáticamente al cargar
    return { items: parsed.items || [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined as unknown as CartState, loadInitialState);

  // Persistir SOLO los items (no isOpen) cada vez que cambian
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, isOpen: false }));
    } catch (e) {
      console.error("No se pudo guardar el carrito en localStorage", e);
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}