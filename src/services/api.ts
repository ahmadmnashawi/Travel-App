/**
 * ============================================================
 * 🔗 API Service Layer — طبقة الربط مع الباك إند (Laravel)
 * ============================================================
 */

import type { Trip, User, Booking, Comment } from '@/types';
import { mockComments } from "@/data/mock-data";

// ⬇️ غيّر هذا الرابط لرابط الباك إند الخاص بك
const BASE_URL = 'http://127.0.0.1:8000/api';

// ============================================================
// 🔑 Token Management — إدارة التوكن
// ============================================================
let authToken: string | null = localStorage.getItem('auth_token');

export const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getToken = () => authToken;

// ============================================================
// 🔧 Helper — دالة مساعدة للطلبات
// ============================================================
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'خطأ في الاتصال بالسيرفر' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  // Handle empty responses (204 No Content)
  if (res.status === 204) return undefined as T;

  return res.json();
}
// ============================================================
// 🛠️ Admin — لوحة التحكم (للمدير فقط)
// ============================================================
export const adminApi = {
  // جلب كافة المستخدمين المسجلين في النظام
  getAllUsers: async (): Promise<User[]> => {
    const data = await request<any>('/admin/users');
    return Array.isArray(data) ? data : (data.data || data);
  },

  // حذف مستخدم نهائياً
  deleteUser: async (userId: string): Promise<void> => {
    await request(`/admin/users/${userId}`, { method: 'DELETE' });
  },

  // حذف أي تعليق (بصلاحية أدمن)
  deleteComment: async (commentId: string): Promise<void> => {
    await request(`/admin/comments/${commentId}`, { method: 'DELETE' });
  },

  // الحصول على إحصائيات عامة (اختياري إذا أردت استخدامه مستقبلاً)
  getStats: async (): Promise<any> => {
    return request('/admin/stats');
  },
};
// ============================================================
// 🔐 Auth — المصادقة
// ============================================================
export const authApi = {
  // POST /api/auth/login
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const data = await request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  console.log("LOGIN RESPONSE:", data);  // 👈 أضيفي هاد

  if (data.access_token) setToken(data.access_token);

  return data;
},
updateProfile: async (payload: any) => {
    return request<any>('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  // POST /api/auth/register
  register: async (name: string, email: string, password: string, password_confirmation?: string): Promise<{ token?: string; user?: User }> => {
    const data = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: password_confirmation || password }),
    });
   if (data.token) setToken(data.token);
   return data;
  },

  // GET /api/auth/logout
  logout: async (): Promise<void> => {
    try {
      await request<any>('/auth/logout', { method: 'POST' }); // طلب السيرفر لحذف التوكن
    } catch {
      // حتى لو فشل الطلب، نستمر بحذف التوكن محليًا
    }
    setToken(null);          // حذف التوكن من localStorage
    // ملاحظة: مسح بيانات المستخدم (setUser(null)) يتم في AuthContext
  },

  // GET /api/auth/profile
   getProfile: async (): Promise<User> => {
  const data = await request<any>('/auth/profile');
  return data.user;
}
};

// ============================================================
// ✈️ Trips — الرحلات
// ============================================================
export const tripsApi = {
  // GET /api/trips
  getAll: async (): Promise<Trip[]> => {
    const data = await request<any>('/trips');
    // Laravel قد يرجع {data: [...]} أو [...] مباشرة
    return Array.isArray(data) ? data : (data.data || data);
  },

  // GET /api/trip/:id
  getById: async (id: string): Promise<Trip> => {
    const data = await request<any>(`/trip/${id}`);
    return data.data || data;
  },

  // POST /api/trips
  create: async (trip: Partial<Trip>): Promise<Trip> => {
    const data = await request<any>('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
    return data.data || data;
  },

  // POST /api/trips/:id (update)
  update: async (id: string, data: Partial<Trip>): Promise<Trip> => {
    const res = await request<any>(`/trips/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data || res;
  },

  // DELETE /api/trips/:id
  delete: async (id: string): Promise<void> => {
    await request(`/trips/${id}`, { method: 'DELETE' });
  },
};

// ============================================================
// 📋 Bookings — الحجوزات
// ============================================================
export const bookingsApi = {
  // GET /api/my-bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const data = await request<any>('/my-bookings');
    return Array.isArray(data) ? data : (data.data || data);
  },

  // GET /api/bookings (admin)
  getAllBookings: async (): Promise<Booking[]> => {
    const data = await request<any>('/bookings');
    return Array.isArray(data) ? data : (data.data || data);
  },

  // POST /api/bookings
  create: async (tripId: string, people?: number): Promise<Booking> => {
  const data = await request<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      trip_id: tripId,
      number_of_people: people || 1
    }),
  });
  return data.booking || data;
},

  // POST /api/bookings/:id/cancel
  cancel: async (id: string): Promise<Booking> => {
    const data = await request<any>(`/bookings/${id}/cancel`, { method: 'POST' });
    return data.data || data;
  },
};

// ============================================================
// ⭐ Reviews — التقييمات والتعليقات
// ============================================================
export const reviewsApi = {

  addRating: async (tripId: string, rating: number) => {
    return request('/reviews/rating', {
      method: 'POST',
      body: JSON.stringify({ trip_id: tripId, rating }),
    });
  },

  addComment: async (tripId: string, comment: string): Promise<Comment> => {
  const data = await request<Comment>(`/reviews/comment`, {
    method: 'POST',
    body: JSON.stringify({ trip_id: tripId, comment }),
  });
  return data; // لا تستخدم data.review
},

  getTripComments: async (tripId: string): Promise<Comment[]> => {
  const data = await request<Comment[]>(`/reviews/${tripId}`);
  return data;
},

  deleteComment: async (id: string) => {
    await request(`/reviews/comment/${id}`, { method: 'DELETE' });
  },
};
export const importMockComments = async (): Promise<any> => {
  if (!mockComments || mockComments.length === 0) return;

  return request('/reviews/import', {  // لاحظ اسم الـ route اللي ضفناه بالباك
    method: 'POST',
    body: JSON.stringify({ comments: mockComments }),
  });
};
// ============================================================
// ❤️ Favorites — المفضلة
// ============================================================
export const favoritesApi = {
  // GET /api/favorites
  getAll: async (): Promise<any[]> => {
    const data = await request<any>('/favorites');
    return Array.isArray(data) ? data : (data.data || data);
  },

  // POST /api/favorites/:tripId (add)
  add: async (tripId: string): Promise<any> => {
    return request(`/favorites/${tripId}`, { method: 'POST' });
  },

  // DELETE /api/favorites/:tripId (remove)
  remove: async (tripId: string): Promise<void> => {
    await request(`/favorites/${tripId}`, { method: 'DELETE' });
  },
};
