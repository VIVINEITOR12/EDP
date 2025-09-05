import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { NovedadesSection } from "@/components/novedades/novedades-section";

const Novedades = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <NovedadesSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Novedades;