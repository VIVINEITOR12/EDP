import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Send, Palette, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const clothingTypes = [
  "Vestido",
  "Blusa",
  "Camisa", 
  "Pantalón",
  "Falda",
  "Chaqueta",
  "Traje completo",
  "Ropa de niños",
  "Otro"
];

const colors = [
  "Negro", "Blanco", "Beige", "Dorado", "Azul marino",
  "Gris", "Marrón", "Verde", "Azul", "Rojo", "Rosa",
  "Amarillo", "Morado", "Combinación de colores"
];

const sizes = [
  "XS", "S", "M", "L", "XL", "XXL", "Medidas personalizadas"
];

export function CustomOrderForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: "",
    clothingType: "",
    colors: "",
    size: "",
    customMeasurements: "",
    name: "",
    email: "",
    phone: "",
    files: [] as File[]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.email || !formData.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Aquí se enviaría la información (por ahora simulamos el envío)
    toast({
      title: "Solicitud Enviada",
      description: "Nos pondremos en contacto contigo pronto para discutir tu diseño personalizado",
    });

    // Crear mensaje para WhatsApp
    const message = `
🎨 SOLICITUD DE DISEÑO PERSONALIZADO

👤 Cliente: ${formData.name}
📧 Email: ${formData.email}
📱 Teléfono: ${formData.phone}

👕 Tipo de prenda: ${formData.clothingType}
🎨 Colores: ${formData.colors}
📏 Talla: ${formData.size}

📝 Descripción del diseño:
${formData.description}

${formData.customMeasurements ? `📐 Medidas personalizadas: ${formData.customMeasurements}` : ''}

${formData.files.length > 0 ? `📎 Archivos adjuntos: ${formData.files.length} archivo(s)` : ''}
    `.trim();

    const whatsappUrl = `https://wa.me/+584123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-beige/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold-light/20 border border-gold/30 mb-6">
            <Palette className="h-4 w-4 text-gold mr-2" />
            <span className="text-sm font-medium text-gold-dark">Diseño Exclusivo</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Crea Tu Diseño Personalizado
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cuéntanos tu visión y haremos realidad la prenda de tus sueños con medidas exactas y diseño único
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descripción del diseño */}
            <div className="md:col-span-2">
              <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                <Shirt className="h-4 w-4 text-gold" />
                Descripción del diseño *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe detalladamente cómo quieres que sea tu prenda: estilo, corte, detalles especiales, inspiración, etc."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] resize-none"
                required
              />
            </div>

            {/* Tipo de prenda */}
            <div>
              <Label htmlFor="clothingType" className="mb-2 block">Tipo de prenda *</Label>
              <Select value={formData.clothingType} onValueChange={(value) => setFormData(prev => ({ ...prev, clothingType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de prenda" />
                </SelectTrigger>
                <SelectContent>
                  {clothingTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Colores */}
            <div>
              <Label htmlFor="colors" className="mb-2 block">Colores preferidos</Label>
              <Select value={formData.colors} onValueChange={(value) => setFormData(prev => ({ ...prev, colors: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona los colores" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Talla */}
            <div>
              <Label htmlFor="size" className="mb-2 block">Talla *</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu talla" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Medidas personalizadas */}
            <div>
              <Label htmlFor="customMeasurements" className="mb-2 block">Medidas personalizadas</Label>
              <Textarea
                id="customMeasurements"
                placeholder="Si seleccionaste 'Medidas personalizadas', especifica aquí tus medidas (busto, cintura, cadera, largo, etc.)"
                value={formData.customMeasurements}
                onChange={(e) => setFormData(prev => ({ ...prev, customMeasurements: e.target.value }))}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Upload de archivos */}
            <div className="md:col-span-2">
              <Label htmlFor="files" className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-gold" />
                Imágenes o bocetos (opcional)
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/50 transition-colors duration-300">
                <input
                  type="file"
                  id="files"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="files" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Haz clic para subir imágenes de referencia o bocetos
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, PDF hasta 10MB cada uno
                  </p>
                </Label>
                {formData.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-foreground">
                      {formData.files.length} archivo(s) seleccionado(s)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4 border-t pt-6">
                Información de Contacto
              </h3>
            </div>

            <div>
              <Label htmlFor="name" className="mb-2 block">Nombre completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="phone" className="mb-2 block">Teléfono (opcional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+58 412 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar Solicitud
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Te contactaremos en las próximas 24 horas para discutir tu diseño
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}