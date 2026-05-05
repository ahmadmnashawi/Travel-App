import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripCard from "@/components/TripCard";
import { mockTrips } from "@/data/mock-data";
import heroImage from "@/assets/hero-travel.jpg";
const features = [
  {
    icon: Compass,
    title: "وجهات متنوعة",
    desc: "اكتشف أجمل الوجهات السياحية حول العالم",
  },
  { icon: Shield, title: "حجز آمن", desc: "نظام حجز موثوق ومؤمّن بالكامل" },
  {
    icon: Star,
    title: "تجارب مميزة",
    desc: "رحلات مختارة بعناية لتجربة لا تُنسى",
  },
];

const Index = () => {
  const featuredTrips = mockTrips.slice(0, 3);

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with subtle floating animation */}
        <motion.img
          src={heroImage}
          alt="وجهة سياحية"
          className="absolute inset-0 w-full h-[110%] object-cover z-0"
          initial={{ y: -20 }}
          animate={{ y: 20 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 5,
            ease: "easeInOut",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/15  z-10"></div>

        {/* Content Box */}
        <motion.div
          className="relative container mx-auto px-4 text-center bg-white/20 backdrop-blur-lg p-8 md:p-16 rounded-xl shadow-xl max-w-3xl z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-4">
            اكتشف العالم <span className="text-secondary">معنا</span>
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-6">
            رحلات سياحية مُنظّمة بعناية لتجعل كل لحظة ذكرى لا تُنسى
          </p>
          <Button size="lg" asChild className="gap-2 px-8 text-base">
            <Link to="/trips">
              تصفّح الرحلات
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
          
      {/* Features */}
      <section className="py-20 bg-muted/50">
      
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 ">
        ميزاتنا
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto">
        اكتشف لماذا رحلاتنا مميزة وموثوقة وتجربة لا تُنسى لكل مسافر
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {features.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2, duration: 0.6 }}
          className="bg-card rounded-2xl p-10 text-center border border-border shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer"
        >
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center mb-5 text-white shadow-md">
            <f.icon className="h-8 w-8" />
          </div>

          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 text-primary-foreground">
            {f.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm md:text-base">
            {f.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Featured Trips */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              رحلات <span className="text-gradient ">مميزة</span>
            </h2>
            <p className="text-muted-foreground">أفضل الرحلات المختارة لك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link to="/trips">
                عرض جميع الرحلات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
      </section>
      
    </div>
  );
};

export default Index;
