import { useState } from "react";
import { Star, Quote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/use-reviews";
import { useToast } from "@/hooks/use-toast";

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange?: (rating: number) => void }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= rating
              ? "text-gold fill-gold"
              : "text-muted-foreground"
          }`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export function TestimonialsSectionDynamic() {
  const { reviews, isLoading, submitReview, getAverageRating } = useReviews();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await submitReview(newReview);
      
      if (success) {
        toast({
          title: "Enviado exitosamente",
          description: "Enviado exitosamente",
        });
        
        setNewReview({ name: '', comment: '', rating: 5 });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al enviar su reseña.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar su reseña.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = getAverageRating();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
              Cargando Testimonios...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating) 
                      ? "text-gold fill-gold" 
                      : "text-muted-foreground"
                  }`} 
                />
              ))}
            </div>
            <span className="text-xl font-semibold text-foreground ml-2">
              {averageRating}/5
            </span>
            <span className="text-muted-foreground">
              ({reviews.length} reseñas)
            </span>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-white">
                <Plus className="w-4 h-4 mr-2" />
                Escribir Reseña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Escribir una Reseña</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label>Calificación</Label>
                  <StarRating 
                    rating={newReview.rating} 
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="comment">Comentario</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Comparte tu experiencia con EDP..."
                    required
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gold hover:bg-gold-dark"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card hover:shadow-lg transition-shadow duration-300 border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Quote className="h-8 w-8 text-gold flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <StarRating rating={testimonial.rating} />
                    <p className="text-muted-foreground mb-4 italic leading-relaxed mt-3">
                      "{testimonial.comment}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-elegant font-semibold text-foreground mb-4">
            ¿Listo para crear tu propia historia de éxito?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestros clientes satisfechos y descubre la diferencia de trabajar con EDP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-white">
              <a href="/catalogo">Ver Catálogo</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold text-gold hover:bg-gold hover:text-white">
              <a href="/personalizado">Diseño Personalizado</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}