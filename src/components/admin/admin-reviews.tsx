import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Trash2 } from "lucide-react";
import { useReviews } from "@/hooks/use-reviews";
import { useToast } from "@/hooks/use-toast";

export function AdminReviews() {
  const { reviews, isLoading, fetchReviews, updateReviewStatus, deleteReview, getAverageRating } = useReviews();
  const { toast } = useToast();

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const success = await updateReviewStatus(id, status);
    if (success) {
      toast({
        title: "Estado actualizado",
        description: `Reseña ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la reseña",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) return;
    
    const success = await deleteReview(id);
    if (success) {
      toast({
        title: "Reseña eliminada",
        description: "La reseña ha sido eliminada exitosamente",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar la reseña",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReviews(true); // Fetch all reviews including pending
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-gold fill-gold"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const averageRating = getAverageRating();

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{reviews.length}</div>
            <div className="text-sm text-muted-foreground">Total Reseñas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
            <div className="text-sm text-muted-foreground">Aprobadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gold">{averageRating}</div>
            <div className="text-sm text-muted-foreground">Promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reseñas</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay reseñas disponibles
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{review.name}</h4>
                        {getStatusBadge(review.status)}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(review.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(review.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    
                    {review.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(review.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Desaprobar
                      </Button>
                    )}
                    
                    {review.status === 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(review.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}