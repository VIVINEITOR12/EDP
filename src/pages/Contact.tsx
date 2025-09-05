import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ContactSection } from "@/components/contact/contact-section";
import { FAQSection } from "@/components/contact/faq-section";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;