import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { tripsApi } from "@/services/api";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Compass, Heart, BookOpen, User, Loader2 } from "lucide-react";
import type { Trip } from "@/types";

const UserDashboard = () => {
  const { user, bookings, favorites, fetchBookings, fetchFavorites, isFavorite } = useAuth();
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripsApi.getAll().catch(() => []),
      fetchBookings(),
      fetchFavorites(),
    ])
      .then(([tripsResponse]) => {
        const tripsArray = Array.isArray(tripsResponse)
          ? tripsResponse
          : Array.isArray((tripsResponse as any)?.data)
            ? (tripsResponse as any).data
            : [];

        setAllTrips(tripsArray);
      })
      .finally(() => setLoading(false));
  }, [fetchBookings, fetchFavorites]);

  // تصفية الرحلات المحجوزة المؤكدة
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  
const bookedTrips = bookings
  .map(b => {
    // نبحث عن الرحلة في allTrips بناءً على المعرف اللي جهزناه فوق
    const idToFind = b.tripId?.toString();
    return allTrips.find(t => t.id.toString() === idToFind);
  })
  .filter(Boolean) as Trip[];
  // تصفية الرحلات المفضلة بناءً على مصفوفة المفضلة في AuthContext
  const favoriteTrips = allTrips.filter(trip => {
    const tripIdStr = trip.id.toString();
    // التأكد أن المعرف موجود في مصفوفة المفضلة مهما كان نوع البيانات
    return favorites.some(favId => favId.toString() === tripIdStr);
  });

  const stats = [
    {
      icon: BookOpen,
      label: "حجوزاتي",
      value: confirmedBookings.length,
      color: "text-primary",
    },
    {
      icon: Heart,
      label: "المفضلة",
      value: favorites.length,
      color: "text-destructive",
    },
  ];

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* ملف المستخدم الشخصي */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
            <User className="h-7 w-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              مرحباً، {user?.name}
            </h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-lg p-5 text-center"
            >
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* قسم الرحلات المحجوزة */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold mb-4 border-r-4 border-primary pr-3">
            رحلاتي المحجوزة
          </h2>
          {bookedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedTrips.map((trip) => (
                <TripCard 
                  key={`booked-${trip.id}`} 
                  trip={trip} 
                  showFavorite={false} // إخفاء القلب في قسم الحجوزات
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-10 text-center border border-dashed border-border">
              <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">لم تحجز أي رحلة بعد</p>
              <Button asChild>
                <Link to="/trips">تصفح الرحلات</Link>
              </Button>
            </div>
          )}
        </section>

        {/* قسم الرحلات المفضلة */}
        <section>
          <h2 className="font-display text-xl font-semibold mb-4 border-r-4 border-destructive pr-3">
            رحلاتي المفضلة
          </h2>
          {favoriteTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTrips.map((trip) => (
                <TripCard 
                  key={`fav-${trip.id}`} 
                  trip={trip} 
                  showFavorite={true} // إظهار القلب في قسم المفضلة
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/20 rounded-lg py-12 text-center border border-border">
              <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لم تضف أي رحلة للمفضلة بعد</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;