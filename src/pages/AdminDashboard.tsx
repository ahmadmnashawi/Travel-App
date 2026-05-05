import { useState, useEffect } from 'react';
import { tripsApi, bookingsApi, reviewsApi, adminApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, BookOpen, MessageCircle, Trash2, User, Plus, Pencil, Loader2, Ban, Search, Calendar, Mail, DollarSign, Tag, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import TripFormDialog from '@/components/TripFormDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Trip, Booking, Comment, User as UserType } from '@/types';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [tripSearch, setTripSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');

  // Dialog states
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteTripId, setDeleteTripId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tripsData, bookingsData, usersData] = await Promise.all([
          tripsApi.getAll().catch(() => []),
          bookingsApi.getAllBookings().catch(() => []),
          adminApi.getAllUsers().catch(() => []),
        ]);
        setTrips(tripsData);
        setAllBookings(bookingsData);
        setUsers(usersData);

        const allComments: Comment[] = [];
        for (const trip of tripsData.slice(0, 20)) {
          try {
            const tripDetail = await tripsApi.getById(trip.id);
            const tripComments = (tripDetail as any).comments || (tripDetail as any).reviews || [];
            tripComments.forEach((c: any) => {
              allComments.push({
                id: c.id?.toString() || Math.random().toString(),
                userId: c.user_id?.toString() || '',
                userName: c.user?.name || c.user?.username || 'مستخدم مجهول',
                tripId: trip.id,
                text: c.content || c.comment || '',
                createdAt: c.created_at || '',
              });
            });
          } catch { /* skip */ }
        }
        setComments(allComments);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { icon: MapPin, label: 'الرحلات', value: trips.length, color: 'text-primary' },
    { icon: BookOpen, label: 'الحجوزات', value: allBookings.length, color: 'text-blue-500' },
    { icon: Users, label: 'المستخدمين', value: users.length, color: 'text-green-500' },
    { icon: MessageCircle, label: 'التعليقات', value: comments.length, color: 'text-orange-500' },
  ];

  // === Handlers ===
  const handleSaveTrip = async (data: any) => {
  try {
    if (editingTrip) {
      // 1. إرسال طلب التعديل
      const response = await tripsApi.update(editingTrip.id, data);
      
      // 2. استخراج الرحلة المحدثة من الرد (حسب هيكلية لارافيل التي أعددناها)
      // لارافيل يرجع { message: "...", trip: {...} }
      const updatedTrip = response.trip || response;

      // 3. تحديث الـ State فوراً
      setTrips(prev => 
        prev.map(t => (t.id === editingTrip.id ? { ...t, ...updatedTrip } : t))
      );
      
      toast({ title: 'تم تحديث الرحلة بنجاح' });
    } else {
      // في حالة الإضافة الجديدة
      const response = await tripsApi.create(data);
      const newTrip = response.trip || response;
      
      setTrips(prev => [...prev, newTrip]);
      toast({ title: 'تمت إضافة الرحلة بنجاح' });
    }
  } catch (error: any) {
    console.error("Save Error:", error);
    toast({ 
      title: 'حدث خطأ أثناء الحفظ', 
      description: error.message, 
      variant: 'destructive' 
    });
  } finally {
    setTripDialogOpen(false);
    setEditingTrip(null);
  }
};

  const handleDeleteTrip = async () => {
    if (!deleteTripId) return;
    try {
      await tripsApi.delete(deleteTripId);
      setTrips(prev => prev.filter(t => t.id !== deleteTripId));
      toast({ title: 'تم حذف الرحلة بنجاح' });
    } catch { toast({ title: 'فشل حذف الرحلة', variant: 'destructive' }); }
    setDeleteTripId(null);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await adminApi.deleteUser(deleteUserId);
      setUsers(prev => prev.filter(u => u.id !== deleteUserId));
      toast({ title: 'تم حذف المستخدم من النظام' });
    } catch { toast({ title: 'فشل حذف المستخدم', variant: 'destructive' }); }
    setDeleteUserId(null);
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      await adminApi.deleteComment(deleteCommentId);
      setComments(prev => prev.filter(c => c.id !== deleteCommentId));
      toast({ title: 'تم حذف التعليق بنجاح' });
    } catch { toast({ title: 'فشل حذف التعليق', variant: 'destructive' }); }
    setDeleteCommentId(null);
  };

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    try {
      await bookingsApi.cancel(cancelBookingId);
      setAllBookings(prev => prev.map(b => b.id === cancelBookingId ? { ...b, status: 'cancelled' } : b));
      toast({ title: 'تم إلغاء الحجز' });
    } catch { toast({ title: 'فشل إلغاء الحجز', variant: 'destructive' }); }
    setCancelBookingId(null);
  };

  // Filters
  const filteredTrips = trips.filter(t => 
    t.name?.toLowerCase().includes(tripSearch.toLowerCase())
  );
  
  const filteredBookings = allBookings.filter(b => 
    b.status?.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => {
    const name = (u.name || u.username || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const searchTerm = userSearch.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  const filteredComments = comments.filter(c => 
    c.text?.toLowerCase().includes(commentSearch.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
      <p className="text-muted-foreground animate-pulse">جاري تحميل بيانات لوحة التحكم...</p>
    </div>
  );

  return (
    <div dir="rtl" className="pt-28 pb-20 container mx-auto px-4 max-w-7xl font-sans">
      
      {/* --- ADMIN HEADER --- */}
      <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 md:p-10 mb-10 shadow-sm transition-all hover:shadow-md">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -z-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary transition-all duration-300">
              <User className="h-12 w-12 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-card"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground">مرحباً بك، أيها المدير</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1"><Mail size={16} /> {user?.email}</span>
              <Badge className="bg-primary hover:bg-primary/90 text-white px-3 py-1">مدير النظام</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-bold mb-1">{s.label}</p>
                <h3 className="text-3xl font-black">{s.value}</h3>
              </div>
              <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN TABS --- */}
      <Tabs defaultValue="trips" className="space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-2xl w-full md:w-fit flex-wrap h-auto gap-2">
          <TabsTrigger value="trips" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">الرحلات</TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">الحجوزات</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">المستخدمين</TabsTrigger>
          <TabsTrigger value="comments" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">التعليقات</TabsTrigger>
        </TabsList>

        {/* 1. TRIPS SECTION */}
        <TabsContent value="trips" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed">
            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-primary" /> إدارة محتوى الرحلات</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input placeholder="بحث باسم الرحلة..." className="pr-10 h-11 bg-card rounded-xl" value={tripSearch} onChange={e => setTripSearch(e.target.value)} />
              </div>
              <Button onClick={() => { setEditingTrip(null); setTripDialogOpen(true); }} className="h-11 rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                <Plus size={20} className="ml-2" /> إضافة رحلة جديدة
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredTrips.map(trip => (
              <div key={trip.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                  <div>
                    <p className="text-[10px] uppercase font-black text-primary/60 mb-1 tracking-widest">اسم الرحلة</p>
                    <p className="font-bold text-lg leading-tight">{trip.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-primary/60 mb-1 tracking-widest">التكلفة</p>
                    <p className="font-black text-xl text-foreground flex items-center"><DollarSign size={14} />{trip.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-primary/60 mb-1 tracking-widest">التصنيف</p>
                    <Badge variant="secondary" className="mt-1">{trip.type}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-primary/60 mb-1 tracking-widest">الحالة</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">نشطة</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 border-t md:border-none pt-4 md:pt-0">
                  <Button variant="outline" className="flex-1 md:flex-none h-10 rounded-xl" onClick={() => { setEditingTrip(trip); setTripDialogOpen(true); }}>
                    <Pencil size={16} className="ml-2"/> تعديل
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => setDeleteTripId(trip.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 2. USERS SECTION */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold">قائمة المستخدمين</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="بحث بالاسم أو البريد..." className="pr-10 h-11 bg-card rounded-xl" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map(u => {
              // حل مشكلة الـ undefined لاسم المستخدم
              const displayUserName = u.name || u.username || 'مستخدم';
              const firstLetter = displayUserName[0]?.toUpperCase() || 'U';

              return (
                <div key={u.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 md:w-1/4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                      {firstLetter}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5">الاسم الكامل</p>
                      <p className="font-bold">{displayUserName}</p>
                    </div>
                  </div>
                  <div className="md:w-1/4">
                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5">البريد الإلكتروني</p>
                    <p className="font-medium text-sm break-all">{u.email || 'غير متوفر'}</p>
                  </div>
                  <div className="md:w-1/4">
                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5">الصلاحية</p>
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="px-4">
                      {u.role === 'admin' ? 'مدير' : 'مستخدم'}
                    </Badge>
                  </div>
                  <div className="flex justify-end md:w-1/4">
                    <Button variant="ghost" className="h-12 w-12 rounded-2xl text-destructive hover:bg-destructive/10" onClick={() => setDeleteUserId(u.id)}>
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* 3. BOOKINGS SECTION */}
        <TabsContent value="bookings" className="space-y-6">
           <div className="flex justify-between items-center bg-card p-4 rounded-2xl border">
            <h2 className="font-bold">سجل الحجوزات</h2>
            <Input placeholder="تصفية بالحالة..." className="w-40" value={bookingSearch} onChange={e => setBookingSearch(e.target.value)} />
          </div>
          <div className="grid gap-4">
            {filteredBookings.map(b => (
              <div key={b.id} className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="grid grid-cols-3 gap-8 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">المعرف</p>
                    <p className="font-mono text-xs mt-1">#{b.id?.toString().slice(-6) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">الحالة</p>
                    <Badge className="mt-1" variant={b.status === 'confirmed' ? 'default' : 'outline'}>
                      {b.status === 'confirmed' ? 'مؤكد' : 'ملغي'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">التاريخ</p>
                    <p className="text-sm font-bold mt-1">{(b as any).created_at || '2026-03-11'}</p>
                  </div>
                </div>
                {b.status === 'confirmed' && (
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 rounded-xl" onClick={() => setCancelBookingId(b.id)}>
                    <Ban size={16} className="ml-2" /> إلغاء الحجز
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 4. COMMENTS SECTION */}
        <TabsContent value="comments" className="space-y-6">
          <div className="grid gap-4">
            {filteredComments.map(c => (
              <div key={c.id} className="bg-card border rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      {(c.userName || 'M')[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{c.userName || 'مستخدم'}</p>
                      <p className="text-[10px] text-muted-foreground">{c.createdAt}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive rounded-xl" onClick={() => setDeleteCommentId(c.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-sm italic text-foreground/80">
                   "{c.text || 'لا يوجد نص'}"
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* --- CONFIRMATION DIALOGS --- */}
      <TripFormDialog open={tripDialogOpen} onOpenChange={setTripDialogOpen} trip={editingTrip} onSave={handleSaveTrip} />
      <ConfirmDialog open={!!deleteTripId} onOpenChange={() => setDeleteTripId(null)} title="حذف الرحلة نهائياً؟" description="لا يمكن استرجاع بيانات الرحلة بعد الحذف." onConfirm={handleDeleteTrip} />
      <ConfirmDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)} title="حذف حساب مستخدم؟" description="سيؤدي هذا إلى طرد المستخدم من النظام فوراً." onConfirm={handleDeleteUser} />
      <ConfirmDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)} title="إزالة هذا التعليق؟" description="سيختفي التعليق من صفحات الرحلات العامة." onConfirm={handleDeleteComment} />
      <ConfirmDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)} title="تأكيد إلغاء الحجز؟" description="سيتم إرسال بريد إلكتروني للمستخدم لإبلاغه." onConfirm={handleCancelBooking} />
    </div>
  );
};

export default AdminDashboard;