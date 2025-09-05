import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { CategoryGrid } from "@/components/catalog/category-grid";

const Catalog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <CategoryGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Catalog;