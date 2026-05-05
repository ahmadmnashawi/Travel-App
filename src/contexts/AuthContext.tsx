import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { User, Booking } from "@/types";
import {
  authApi,
  bookingsApi,
  favoritesApi,
  getToken,
  setToken,
} from "@/services/api";

// 1. تعريف شكل البيانات اللي بيوفرها الـ Context للموقع كلو
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: {
    name: string;
    email: string;
    avatar?: string;
    password?: string;
    password_confirmation?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  bookings: Booking[];
  favorites: string[];
  addBooking: (tripId: string, seats?: number) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  toggleFavorite: (tripId: string) => Promise<void>;
  isFavorite: (tripId: string) => boolean;
  loading: boolean;
  fetchBookings: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook مخصص لسهولة استخدام الـ Context في أي مكان
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // عند تشغيل التطبيق: جلب بيانات المستخدم والتوكن
 // داخل AuthProvider في ملف AuthContext.tsx
  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi
        .getProfile()
        .then((userData) => {
          setUser(userData);
          return Promise.all([
            bookingsApi.getMyBookings().catch(() => []),
            favoritesApi.getAll().catch(() => []),
          ]);
        })
        .then(([bookingsData, favoritesData]) => {
          // 💡 إصلاح الحجوزات: إضافة tripId لكل حجز
          const formattedBookings = (bookingsData || []).map((b: any) => ({
            ...b,
            tripId: (b.trip_id || b.tripId || b.trip?.id)?.toString(),
          }));
          setBookings(formattedBookings);

          // 💡 إصلاح المفضلة: التأكد من أنها مصفوفة IDs فقط
          const rawFavs = Array.isArray(favoritesData) ? favoritesData : (favoritesData?.data || []);
          const favIds = rawFavs.map((f: any) => (f.id || f.trip_id || f.pivot?.trip_id)?.toString()).filter(Boolean);
          setFavorites([...new Set(favIds)]);
        })
        .catch(() => setToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // دالة تسجيل الدخول
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const data = await authApi.login(email, password);
        setUser(data.user);
        // جلب البيانات فور الدخول
        const [bookingsData, favoritesData] = await Promise.all([
          bookingsApi.getMyBookings().catch(() => []),
          favoritesApi.getAll().catch(() => []),
        ]);
        setBookings(bookingsData || []);
        return true;
      } catch (err: any) {
        console.error("Login failed:", err.message);
        return false;
      }
    },
    []
  );

  // دالة إنشاء حساب جديد
  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        const data = await authApi.register(name, email, password);
        setUser(data.user);
        return true;
      } catch (err: any) {
        console.error("Register failed:", err.message);
        return false;
      }
    },
    []
  );

  // دالة تسجيل الخروج
  const logout = useCallback(async (callback?: () => void) => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    setBookings([]);
    setFavorites([]);
    if (callback) callback();
  }, []);

  // الدالة المطلوبة: تحديث بيانات الملف الشخصي والربط مع السيرفر
  const updateProfile = useCallback(
    async (data: { 
      name: string; 
      email: string; 
      avatar?: string; 
      password?: string; 
      password_confirmation?: string 
    }) => {
      try {
        const response = await authApi.updateProfile({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          avatar: data.avatar
        });

        // تحديث الحالة محلياً ليراها المستخدم فوراً
        setUser((prev) =>
          prev ? { 
            ...prev, 
            username: response.user.username, // التزمنا بـ username حسب Laravel
            email: response.user.email,
            avatar: data.avatar || prev.avatar 
          } : null
        );
        return { success: true };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    []
  );

  // جلب الحجوزات
  const fetchBookings = useCallback(async () => {
  try {
    const data = await bookingsApi.getMyBookings();
    // لارافيل أحياناً يرسل المصفوفة مباشرة وأحياناً بداخل data.data
    const rawBookings = Array.isArray(data) ? data : (data.data || []);

    const formattedBookings = rawBookings.map((b: any) => ({
      ...b,
      // 💡 السحر هنا: نضمن أن الفرونت يرى المعرف بكل الأسماء الممكنة
      id: b.id?.toString(),
      tripId: (b.trip_id || b.tripId || b.trip?.id)?.toString(),
      status: b.status || 'confirmed'
    }));

    setBookings(formattedBookings);
    console.log("Bookings loaded successfully:", formattedBookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
}, []);

  // جلب المفضلة
 const fetchFavorites = useCallback(async () => {
  try {
    const data = await favoritesApi.getAll();
    const rawFavs = Array.isArray(data) ? data : (data.data || []);

    // لارافيل في الكود اللي بعتته بيرجع كائنات رحلات (Trips) مباشرة
    const processedIds = rawFavs.map((f: any) => {
      // نأخذ الـ id سواء كان الحقل اسمه id أو trip_id
      return (f.id || f.trip_id || f.pivot?.trip_id)?.toString();
    }).filter(Boolean);

    setFavorites([...new Set(processedIds)]); // حذف التكرار
    console.log("Favorites IDs loaded:", processedIds);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    setFavorites([]);
  }
}, []);

  // إضافة حجز
  const addBooking = useCallback(async (tripId: string, seats?: number) => {
    try {
      // 1. تأكد أن استدعاء الـ API يرجع كائن من نوع Booking
      const response = await bookingsApi.create(tripId, seats);
      
      // 2. إذا كان الـ API يرجع بيانات الحجز مباشرة (Object)
      const newBooking: Booking = response; 

      setBookings((prev) => [...prev, newBooking]);
    } catch (error: any) {
      console.error("Booking failed:", error.message);
      throw error;
    }
  }, []);

  // إلغاء حجز
  const cancelBooking = useCallback(async (bookingId: string) => {
    await bookingsApi.cancel(bookingId);
    setBookings((prev) =>
      prev.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b)
    );
  }, []);

  // إضافة/حذف من المفضلة
  const toggleFavorite = useCallback(async (tripId: string | number) => {
    const idStr = tripId.toString();
    try {
      if (favorites.includes(idStr)) {
        await favoritesApi.remove(idStr);
        setFavorites(prev => prev.filter(id => id !== idStr));
      } else {
        await favoritesApi.add(idStr);
        setFavorites(prev => [...prev, idStr]);
      }
    } catch (err) { console.error("Error toggling favorite", err); }
  }, [favorites]);

  const isFavorite = useCallback((tripId: string) => favorites.includes(tripId), [favorites]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        bookings,
        favorites,
        addBooking,
        cancelBooking,
        toggleFavorite,
        isFavorite,
        loading,
        fetchBookings,
        fetchFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};