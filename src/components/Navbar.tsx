import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard, Plane } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/trips', label: 'الرحلات' },
    { to: '/about', label: 'من نحن' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // 🔹 دالة تسجيل الخروج مع إعادة التوجيه
  const handleLogout = () => {
    logout();         // مسح التوكن وبيانات المستخدم
    navigate('/login'); // التوجيه لصفحة تسجيل الدخول
    setIsOpen(false); // إغلاق قائمة الموبايل إذا مفتوحة
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-gradient">
            <Plane className="h-6 w-6 text-blue-500 animate-bounce" />
            مسار
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isActive(link.to) ? 'text-blue-500' : 'text-gray-600'
                } relative`}
              >
                {link.label}
                <span
                  className={`absolute right-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 ${
                    isActive(link.to) ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            ))}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الملف الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">إنشاء حساب</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.to) ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm text-gray-600"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-sm text-red-500 w-full text-left"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    إنشاء حساب
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;