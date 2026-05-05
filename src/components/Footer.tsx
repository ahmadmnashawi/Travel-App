import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 text-secondary">مسار</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              منصتك المثالية لتنظيم وحجز الرحلات السياحية. اكتشف وجهات جديدة واصنع ذكريات لا تُنسى.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">الرئيسية</Link>
              <Link to="/trips" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">الرحلات</Link>
              <Link to="/login" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">تسجيل الدخول</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">تواصل معنا</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-secondary" />
                info@rihlat.com
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-secondary" />
                +966 55 123 4567
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-secondary" />
                الرياض، المملكة العربية السعودية
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">© 2026 مسار. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
