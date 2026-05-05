import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Save, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // حالات الإدخال - نستخدم username لأن هذا ما يرجعه الباك إند عندك
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  // تحديث القيم عند تغير بيانات المستخدم (مثلاً بعد تسجيل الدخول)
  useEffect(() => {
    if (user) {
      setName(user.username || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمة المرور إذا تم إدخالها
    if (password && password !== confirmPassword) {
      toast({ 
        title: 'خطأ في التحقق', 
        description: 'كلمتا المرور غير متطابقتين', 
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // نرسل البيانات للـ Context الذي بدوره سينادي الـ API
      const result = await updateProfile({ 
        name, 
        email, 
        password,
        // ملاحظة: الـ API يتوقع password_confirmation
        avatar: avatarPreview 
      });

      // إذا كان الـ updateProfile يرجع success/failure (حسب التعديل الذي اقترحته لك سابقاً)
      toast({ 
        title: 'تم التحديث', 
        description: 'تم تحديث بيانات ملفك الشخصي بنجاح' 
      });
      
      // تفريغ حقول كلمة المرور بعد النجاح
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ 
        title: 'فشل التحديث', 
        description: error.message || 'حدث خطأ أثناء حفظ البيانات', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // توليد الحروف الأولى للاسم في حال عدم وجود صورة
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div dir="rtl" className="pt-24 pb-16 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8 text-right">إعدادات الملف الشخصي</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* قسم الصورة الشخصية */}
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                  <AvatarImage src={avatarPreview} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-2 border-dashed border-white/50">
                  <Camera className="h-8 w-8 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-gray-800">{name || 'مستخدم جديد'}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mt-1">
                  {user?.role === 'admin' ? 'مدير النظام' : 'مسافر'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* المعلومات الأساسية */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5 text-primary" /> المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="أدخل اسمك الكامل"
                  required 
                  className="bg-gray-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> البريد الإلكتروني
                </Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="bg-gray-50/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* تغيير كلمة المرور */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                <Lock className="h-5 w-5 text-primary" /> أمان الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور الجديدة</Label>
                <Input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="اتركها فارغة إذا لم ترد التغيير" 
                  className="bg-gray-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="أعد كتابة كلمة المرور الجديدة"
                  className="bg-gray-50/50" 
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full gap-2 h-12 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري حفظ التغييرات...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> حفظ التغييرات
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;