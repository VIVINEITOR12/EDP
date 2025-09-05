import { MessageCircle } from "lucide-react";
import { Button } from "./button";

export function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/584249539367?text=Hola%2C%20quisiera%20información%20sobre%20sus%20productos";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">WhatsApp</span>
        </a>
      </Button>
    </div>
  );
}