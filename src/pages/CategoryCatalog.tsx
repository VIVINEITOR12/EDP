import { useState, useEffect } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { CategoryTabs } from "@/components/catalog/category-tabs";
import { ProductGrid } from "@/components/catalog/product-grid";
import { useProducts } from "@/hooks/use-products";

const categories = {
  "mujeres": {
    name: "Mujeres",
    subcategories: [
      { key: "casual", name: "Casual" },
      { key: "vestidos", name: "Vestidos" },
      { key: "pantalones", name: "Pantalones" },
      { key: "chaquetas", name: "Chaquetas" },
      { key: "sport", name: "Sport" },
      { key: "interior", name: "Interior" },
      { key: "baño", name: "Baño" },
      { key: "formal", name: "Formal" }
    ]
  },
  "hombres": {
    name: "Hombres", 
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "chaquetas", name: "Chaquetas" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "polos", name: "Polos" },
      { key: "sport", name: "Sport" },
      { key: "baño", name: "Baño" },
      { key: "formal", name: "Formal" }
    ]
  },
  "ninos": {
    name: "Niños",
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "uniformes", name: "Uniformes" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "sport", name: "Sport" },
      { key: "temporada", name: "Temporada" }
    ]
  },
  "ninas": {
    name: "Niñas",
    subcategories: [
      { key: "vestidos", name: "Vestidos" },
      { key: "blusas", name: "Blusas" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "escolar", name: "Escolar" },
      { key: "sport", name: "Sport" },
      { key: "baño", name: "Baño" },
      { key: "accesorios", name: "Accesorios" }
    ]
  }
};

const CategoryCatalog = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const { getProductsByCategory, isLoading } = useProducts();

  // Update activeSubcategory from URL parameters
  useEffect(() => {
    const subcategoryParam = searchParams.get("subcategory");
    if (subcategoryParam) {
      setActiveSubcategory(subcategoryParam);
    }
  }, [searchParams]);

  // Update URL when subcategory changes
  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    if (subcategory === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ subcategory });
    }
  };

  // Check if category exists
  if (!category || !categories[category as keyof typeof categories]) {
    return <Navigate to="/catalogo" replace />;
  }

  const categoryData = categories[category as keyof typeof categories];
  const allProducts = getProductsByCategory(category);
  const filteredProducts = activeSubcategory === "all" 
    ? allProducts 
    : getProductsByCategory(category, activeSubcategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-lg text-muted-foreground">Cargando productos...</div>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
              {categoryData.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra colección exclusiva de {categoryData.name.toLowerCase()}
            </p>
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            subcategories={categoryData.subcategories}
            activeSubcategory={activeSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CategoryCatalog;