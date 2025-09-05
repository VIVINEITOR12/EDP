import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { TestimonialsSectionDynamic } from "@/components/testimonials/testimonials-section-dynamic";

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <TestimonialsSectionDynamic />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Testimonials;