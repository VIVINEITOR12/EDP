import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useProductReviews } from "@/hooks/use-product-reviews";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { reviews, rating, isLoading, submitReview } = useProductReviews(productId);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: 5
  });

  const renderStars = (rating: number, interactive = false, size = "h-4 w-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? "text-gold fill-gold"
                : "text-muted-foreground hover:text-gold"
            }`}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const success = await submitReview(formData);
    
    if (success) {
      toast({
        title: "Enviado exitosamente",
        description: "Enviado exitosamente"
      });
      setFormData({ name: "", comment: "", rating: 5 });
      setShowForm(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reseñas del Producto</span>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(!showForm)}
              disabled={isSubmitting}
            >
              {showForm ? "Cancelar" : "Escribir Reseña"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(rating.avgRating))}
              <span className="text-lg font-semibold">{rating.avgRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              ({rating.reviewCount} {rating.reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>

          {/* Review Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Escribe tu Reseña</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tu Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Escribe tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Calificación</Label>
                      {renderStars(formData.rating, true, "h-6 w-6")}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Tu Comentario</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Comparte tu experiencia con este producto..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aún no hay reseñas para este producto. ¡Sé el primero en escribir una!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{review.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}