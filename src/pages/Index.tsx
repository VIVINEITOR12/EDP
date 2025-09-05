import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProcessSection } from "@/components/home/process-section";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CategoryGrid />
        <ProcessSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
