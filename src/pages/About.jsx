import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Compass, Shield, Star } from "lucide-react";
import { Users, Map, Globe, CheckCircle2 } from "lucide-react";

const teamFeatures = [
  {
    icon: Compass,
    title: "وجهات متنوعة",
    desc: "نقدم رحلات لأجمل الوجهات حول العالم",
  },
  { icon: Shield, title: "حجز آمن", desc: "نظام حجز موثوق ومؤمّن بالكامل" },
  {
    icon: Star,
    title: "تجارب مميزة",
    desc: "رحلات مختارة بعناية لتجربة لا تُنسى",
  },
];
const stats = [
  { label: "مسافر سعيد", value: "+100", icon: Users },
  { label: "وجهة سياحية", value: "+15", icon: Map },
  { label: "تقييم إيجابي", value: "4.9", icon: Star },
  { label: "دولة حول العالم", value: "+10", icon: Globe },
];
const AboutUs = () => {
  return (
    <div dir="rtl" className=" space-y-32">
      {/* Hero Section */}
      <section className="relative h-60 flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white py-12 md:py-20"></section>

      {/* About Section */}
      <section className="container mx-auto px-4 md:px-0 max-w-5xl space-y-6 md:space-y-8 text-center py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            رحلاتنا مصممة لكل محبي السفر
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl">
            نحن وكالة سياحية متخصصة بتنظيم الرحلات حول العالم. نحرص على تقديم
            أفضل التجارب السياحية لكل مسافر، مع التركيز على الراحة والأمان
            والاستمتاع.
          </p>
          <section className="relative z-30 mt-10 container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 bg-card border border-border p-5 md:p-6 rounded-2xl shadow-lg">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2 relative">
                  {/* الأيقونة بحجم بسيط */}
                  <div className="mx-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    {/* الرقم بالخط الأساسي العريض */}
                    <h4 className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </h4>
                    {/* العنوان بخط نظامي وواضح */}
                    <p className="text-muted-foreground text-xs md:text-sm font-normal">
                      {stat.label}
                    </p>
                  </div>

                  {/* فاصل بسيط جداً بين العناصر */}
                  {i !== stats.length - 1 && (
                    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </section>

      {/* Features / Team */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
          {teamFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-card p-8 md:p-10 rounded-2xl text-center border border-border shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center mb-5 text-white shadow-md">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            جاهز لتبدأ رحلتك؟
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-6">
            تصفح رحلاتنا واختر المغامرة التي تناسبك الآن!
          </p>
          <Button size="lg" asChild className="gap-2 ">
            <Link to="/trips">تصفّح الرحلات</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
