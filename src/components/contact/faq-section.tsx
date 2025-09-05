import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "¿Hacen envíos a toda Venezuela?",
    answer: "Sí, realizamos envíos a cualquier estado del país a través de empresas de encomiendas seguras."
  },
  {
    question: "¿Puedo pedir un diseño personalizado?",
    answer: "¡Claro! Contamos con una sección especial para pedidos personalizados. Puedes indicarnos tu idea y te asesoramos."
  },
  {
    question: "¿Cuánto tiempo tarda un pedido personalizado?",
    answer: "Depende del diseño, pero usualmente entre 5 a 10 días hábiles. Te damos una fecha estimada al confirmar el pedido."
  },
  {
    question: "¿Aceptan pagos en bolívares o solo en dólares?",
    answer: "Aceptamos pagos en ambas monedas: bolívares (al cambio del día) y dólares."
  },
  {
    question: "¿Tienen tienda física?",
    answer: "Sí, estamos ubicados en Maturín, estado Monagas, pero también trabajamos vía online para comodidad de nuestros clientes."
  }
];

export function FAQSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background/50 backdrop-blur-sm border border-border/30 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}