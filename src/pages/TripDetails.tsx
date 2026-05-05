import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  ArrowRight,
  MessageCircle,
  Send,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { tripsApi, reviewsApi, bookingsApi } from "@/services/api";

const TripDetails = ({ mockTrip }: { mockTrip?: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    toggleFavorite,
    isFavorite,
    user,
    fetchBookings,
  } = useAuth();
  const [trip, setTrip] = useState<any>(mockTrip || null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [seats, setSeats] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "apple" | "cash"
  >("credit");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // =========================
  // Fetch trip if not passed as prop
  // =========================
  useEffect(() => {
    if (!trip) {
      tripsApi
        .getById(id!)
        .then(setTrip)
        .catch(() => toast.error("خطأ بجلب الرحلة"));
    }
  }, [id, trip]);

  // =========================
  // Load reviews
  // =========================
  useEffect(() => {
    if (!trip) return;
    const formatted = (trip.reviews || []).map((c: any) => ({
      id: c.id,
      userName: c.user?.username || "مستخدم",
      text: c.comment,
      rating: c.rating,
      userId: c.user?.id,
    }));
    setComments(formatted);
  }, [trip]);

  // =========================
  // Handle comment
  // =========================
  const handleComment = async () => {
    if (!isAuthenticated) {
      toast.info("يرجى تسجيل الدخول للتعليق");
      navigate("/login");
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) {
      toast.error("لا يمكن إضافة تعليق فارغ");
      return;
    }

    const alreadyCommented = comments.some((c) => c.userId === user.id);
    if (alreadyCommented) {
      toast.error("لقد أضفت تعليقًا مسبقًا");
      return;
    }

    try {
      const newComment = await reviewsApi.addComment(trip.id, trimmed);
      setComments([
        {
          id: newComment.id,
          userId: user.id,
          userName: user.name,
          text: trimmed,
          rating: 0,
        },
        ...comments,
      ]);
      setCommentText("");
      toast.success("تم إضافة التعليق");
    } catch (err) {
      toast.error("حدث خطأ أثناء إضافة التعليق");
    }
  };

  // =========================
  // Handle booking with Validation
  // =========================
  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول لإتمام الحجز");
      navigate("/login");
      return;
    }

    // === التحقق من بيانات البطاقة ===
    if (paymentMethod === "credit") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("يرجى إدخال رقم بطاقة صحيح (16 رقم)");
        return;
      }
      if (!expiry.includes("/") || expiry.length < 5) {
        toast.error("يرجى إدخال تاريخ انتهاء صحيح MM/YY");
        return;
      }
      if (cvv.length < 3) {
        toast.error("يرجى إدخال رمز CVV صحيح");
        return;
      }
    }

    try {
      await bookingsApi.create(trip.id, seats);
      setOrderConfirmed(true);
      toast.success("تم الحجز بنجاح!");

      // تحديث قائمة الحجوزات في الخلفية
      fetchBookings();
    } catch (err: any) {
      console.error("Booking Error:", err);
      toast.error(err.message || "حدث خطأ أثناء الحجز");
    }
  };

  const tripPrice = parseFloat(trip?.price || 0);
  const serviceFee = +(tripPrice * seats * 0.05).toFixed(2);
  const total = +(tripPrice * seats + serviceFee).toFixed(2);

  if (!trip) {
    return <div className="pt-20 text-center">جاري تحميل تفاصيل الرحلة...</div>;
  }

  return (
    <div dir="rtl" className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرحلات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <img
              src={trip?.image_url || trip?.images?.[0] || "/placeholder.jpg"}
              alt={trip.name}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />

            <Badge className="mb-3">{trip.type}</Badge>

            <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
            <p className="text-muted-foreground mb-8">{trip.description}</p>

            {/* Comments */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                التعليقات ({comments.length})
              </h2>

              {isAuthenticated &&
                !comments.some((c) => c.userName === user?.name || c.userId === user?.id) && (
                  <div className="flex gap-3 mb-6">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="أضف تعليقك..."
                      rows={2}
                    />
                    <Button size="icon" onClick={handleComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">
                        {comment.userName}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    لا توجد تعليقات بعد
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-24">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">
                  ${trip.price}
                </span>
                <span className="text-sm text-muted-foreground mr-1">
                  / للشخص
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {trip.location}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />{" "}
                  {trip.start_date} → {trip.end_date}
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> {trip.max_capacity}{" "}
                  مقعد
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.info("يرجى تسجيل الدخول لإتمام الحجز");
                    navigate("/login");
                    return;
                  }
                  setShowCheckout(true);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                احجز الآن
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => toggleFavorite(trip.id)}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorite(trip.id.toString())
                        ? "fill-destructive text-destructive"
                        : ""
                    }`}
                  />
                  {isFavorite(trip.id.toString())
                    ? "في المفضلة"
                    : "أضف للمفضلة"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          {!orderConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  ملخص الحجز
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                <div className="flex gap-3 bg-muted/50 rounded-lg p-3">
                  <img
                    src={trip.images?.[0] || trip.image_url || "/placeholder.jpg"}
                    alt={trip.name}
                    className="w-20 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {trip.location}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {trip.start_date} →{" "}
                      {trip.end_date}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    عدد المقاعد
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      disabled={seats <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-display text-xl font-bold w-8 text-center">
                      {seats}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        setSeats((s) => Math.min(trip.max_capacity, s + 1))
                      }
                      disabled={seats >= trip.max_capacity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      ({trip.max_capacity} متاح)
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">سعر المقعد</span>
                    <span>${trip.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المقاعد</span>
                    <span>×{seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      رسوم الخدمة (5%)
                    </span>
                    <span>${serviceFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-display font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-primary">${total}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    طريقة الدفع
                  </Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: "credit" | "apple" | "cash") =>
                      setPaymentMethod(value)
                    }
                    className="space-y-2"
                  >
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "credit" ? "border-primary bg-primary/5" : "border-border"}`}
                      htmlFor="credit"
                    >
                      <RadioGroupItem value="credit" id="credit" />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">بطاقة ائتمان</p>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "apple" ? "border-primary bg-primary/5" : "border-border"}`}
                      htmlFor="apple"
                    >
                      <RadioGroupItem value="apple" id="apple" />
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Apple Pay</p>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border"}`}
                      htmlFor="cash"
                    >
                      <RadioGroupItem value="cash" id="cash" />
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">الدفع عند الوصول</p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {paymentMethod === "credit" && (
                  <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-xs">رقم البطاقة</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").substring(0, 16))}
                        placeholder="0000 0000 0000 0000"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">تاريخ الانتهاء</Label>
                        <Input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value.substring(0, 5))}
                          placeholder="MM/YY"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">CVV</Label>
                        <Input
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                          placeholder="123"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleConfirmOrder}
                >
                  <Check className="h-4 w-4" />
                  {paymentMethod === "cash" 
                    ? "تأكيد الحجز (دفع عند الوصول)" 
                    : `تأكيد ودفع — $${total}`}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold">
                تم الحجز بنجاح! 🎉
              </h2>
              <p className="text-muted-foreground text-sm">
                تم حجز {seats} مقعد في رحلة <strong>{trip.name}</strong>
              </p>
              <p className="text-muted-foreground text-sm">
                المبلغ الإجمالي:{" "}
                <strong className="text-primary">${total}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                {paymentMethod === "cash" 
                  ? "يرجى تجهيز المبلغ للدفع عند الوصول." 
                  : "سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني."}
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderConfirmed(false);
                  }}
                >
                  إغلاق
                </Button>
                <Button asChild>
                  <Link to="/dashboard">حجوزاتي</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetails;