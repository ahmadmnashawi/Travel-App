import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success('تم إنشاء الحساب بنجاح');
        navigate('/dashboard');
      } else {
        console.log(success)
        toast.error('فشل في إنشاء الحساب');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">إنشاء حساب</h1>
            <p className="text-muted-foreground text-sm">انضم إلينا واكتشف رحلات مذهلة</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="أحمد محمد" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
