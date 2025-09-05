import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { CustomOrderEnhanced } from "@/components/custom-order/custom-order-enhanced";

const CustomOrder = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <CustomOrderEnhanced />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CustomOrder;