export type TripCategory = 'مغامرات' | 'عائلية' | 'فاخرة' | 'ثقافية' | 'صحراوية';

export interface Trip {
  id: string;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  max_capacity: number;
  images: string[];
  type: string;
  createdAt?: string;
  createdBy?: string;
}

export interface User {
  id: string;
  username: string; // 👈 غيرناها من name لـ username لتطابق Laravel
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt?: string; // جعلناها اختيارية لأنها قد لا تعود دائماً
}

// أضف هذا التعريف لعمليات التحديث (Profile Update)
export interface UpdateProfileData {
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  password_confirmation?: string;
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  tripId: string;
  text: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  tripId: string;
}