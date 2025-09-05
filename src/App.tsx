import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/components/cart/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import CategoryCatalog from "./pages/CategoryCatalog";
import CustomOrder from "./pages/CustomOrder";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Novedades from "./pages/Novedades";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/catalogo/:category" element={<CategoryCatalog />} />
            <Route path="/personalizado" element={<CustomOrder />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/testimonios" element={<Testimonials />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSidebar />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
