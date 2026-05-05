import { Link } from 'react-router-dom';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface TripCardProps {
  trip: Trip;
  showFavorite?: boolean; // خاصية للتحكم بظهور زر المفضلة
}

const categoryColors: Record<string, string> = {
  'مغامرات': 'bg-accent text-accent-foreground',
  'عائلية': 'bg-secondary/20 text-secondary-foreground',
  'فاخرة': 'bg-gold/20 text-gold-foreground',
  'ثقافية': 'bg-primary/10 text-primary',
  'صحراوية': 'bg-secondary/10 text-secondary',
};

const TripCard = ({ trip, showFavorite = true }: TripCardProps) => {
  const { isAuthenticated, toggleFavorite, isFavorite } = useAuth();

  // حماية في حال كانت البيانات غير موجودة
  if (!trip) return null;

  return (
    <Link to={`/trips/${trip.id}`} className="group block">
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 group-hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={trip?.image_url || trip?.images?.[0] || "/placeholder.jpg"}
            alt={trip?.name || "رحلة"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          <div className="absolute top-3 right-3">
            <Badge className={categoryColors[trip.type] || 'bg-muted text-muted-foreground'}>
              {trip.type}
            </Badge>
          </div>

          {/* يظهر القلب فقط إذا كان المستخدم مسجلاً وكان showFavorite صحيحاً */}
          {isAuthenticated && showFavorite && (
            <button
              onClick={(e) => { 
                e.preventDefault(); // منع الانتقال لصفحة التفاصيل عند كبس القلب
                toggleFavorite(trip.id); 
              }}
              className="absolute top-3 left-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors z-10"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isFavorite(trip.id.toString()) 
                    ? 'fill-destructive text-destructive' 
                    : 'text-muted-foreground'
                }`} 
              />
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {trip.name}
          </h3>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <MapPin className="h-3.5 w-3.5" />
            {trip.location}
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <Calendar className="h-3 w-3" />
            {trip.start_date}
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
            <span className="font-display text-xl font-bold text-primary">${trip.price}</span>
            <span className="text-xs text-muted-foreground">{trip.max_capacity} مقعد متاح</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;