"use client";
import { mockTrips } from "@/data/mock-data";
import type { Trip } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TripCard from "@/components/TripCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, MapPin, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripCategory } from "@/types";

const categories: (TripCategory | "الكل")[] = [
  "الكل",
  "مغامرات",
  "عائلية",
  "فاخرة",
  "ثقافية",
  "صحراوية",
];

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";

const TripsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0]);
  const [selectedDestination, setSelectedDestination] = useState("الكل");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/trips/mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTrips),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Received from backend:", data.trips);
        setTrips(data.trips); // نعبي الـ state بالبيانات من الباك
      })
      .catch((err) => {
        // بدون باك إند (مثل نسخة العرض على GitHub Pages) نعرض البيانات التجريبية
        console.error(err);
        setTrips(mockTrips);
      });
  }, []);
  const destinations = [
    "الكل",
    ...Array.from(new Set(trips.map((t) => t.location))),
  ];

  const maxPrice = trips.length ? Math.max(...trips.map((t) => t.price)) : 0;
  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([maxPrice]);
    }
  }, [maxPrice]);
  // منطق الفلترة المحسن
  const filtered = useMemo(() => {
    let result = [...trips];

    if (selectedCategory !== "الكل") {
      result = result.filter((t) => t.type === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q),
      );
    }
    if (priceRange[0] < maxPrice) {
      result = result.filter((t) => t.price <= priceRange[0]);
    }
    if (selectedDestination !== "الكل") {
      result = result.filter((t) => t.location === selectedDestination);
    }

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);
      case "price-desc":
        return result.sort((a, b) => b.price - a.price);
      case "date-asc":
        return result.sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
        );
      case "date-desc":
        return result.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
        );
      default:
        return result;
    }
  }, [
    trips,
    selectedCategory,
    searchQuery,
    priceRange,
    selectedDestination,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedCategory !== "الكل" ||
    searchQuery.trim() ||
    priceRange[0] < maxPrice ||
    selectedDestination !== "الكل" ||
    sortBy !== "default";

  const resetFilters = () => {
    setSelectedCategory("الكل");
    setSearchQuery("");
    setPriceRange([maxPrice]);
    setSelectedDestination("الكل");
    setSortBy("default");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pt-24 pb-16"
    >
      <div className="container mx-auto px-4">
        {/* العناوين الرئيسية مع حركة ظهور */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-6xl font-black mb-4 tracking-tight">
            استكشف{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              عالمك
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            مجموعة مختارة من أفضل الرحلات والوجهات السياحية التي تناسب تطلعاتك
          </p>
        </motion.div>

        {/* شريط البحث الملتصق */}
        <div className=" top-24 z-40 mb-10">
          <div className="max-w-3xl mx-auto bg-background/60 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                placeholder="إلى أين تريد الذهاب؟"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 bg-transparent border-none focus-visible:ring-0 text-lg"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "secondary"}
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 rounded-xl gap-2 transition-all active:scale-95"
            >
              <SlidersHorizontal className="h-4 w-4" />
              تصفية
            </Button>
          </div>
        </div>

        {/* تصنيفات الرحلات كأزرار أنيقة */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "bg-card border border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* لوحة الفلاتر المتقدمة مع حركة انزلاق */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-card/80 border border-primary/10 rounded-3xl p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
                <div className="space-y-3">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> الوجهة
                  </label>
                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                  >
                    <SelectTrigger className="rounded-xl bg-background/50 border-primary/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-primary" /> الترتيب حسب
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as SortOption)}
                  >
                    <SelectTrigger className="rounded-xl bg-background/50 border-primary/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">الافتراضي</SelectItem>
                      <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                      <SelectItem value="price-desc">
                        السعر: من الأعلى
                      </SelectItem>
                      <SelectItem value="date-asc">التاريخ: الأقرب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold">الميزانية</label>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                      ${priceRange[0]}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={maxPrice}
                    step={100}
                    className="py-4"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* مؤشر الفلاتر النشطة */}
        {hasActiveFilters && (
          <div className="flex justify-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 rounded-full border border-red-100"
            >
              <X className="h-4 w-4" /> مسح جميع الإعدادات
            </Button>
          </div>
        )}

        {/* شبكة النتائج مع حركات دخول للعناصر */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((trip) => (
              <motion.div
                layout
                key={trip.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* حالة عدم وجود نتائج */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-card/30 rounded-3xl border-2 border-dashed border-muted mt-10"
          >
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              لا توجد نتائج تطابق بحثك
            </h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              جرب استخدام كلمات بحث مختلفة أو قم بإزالة بعض الفلاتر
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="mt-6 rounded-full"
            >
              إعادة تعيين البحث
            </Button>
          </motion.div>
        )}

        {/* عدد النتائج في الأسفل */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-muted-foreground bg-muted/50 inline-block px-4 py-1 rounded-full">
            تم العثور على {filtered.length} رحلة مذهلة
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripsPage;
