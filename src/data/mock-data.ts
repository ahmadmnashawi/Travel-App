import tripAdventure from "@/assets/trip-adventure.jpg";
import tripFamily from "@/assets/trip-family.jpg";
import tripLuxury from "@/assets/trip-luxury.jpg";
import tripCultural from "@/assets/trip-cultural.jpg";
import tripDesert from "@/assets/trip-desert.jpg";
import tripBeach from "@/assets/trip-beach.jpg";
import tripCity from "@/assets/trip-city.jpg";
import tripSnow from "@/assets/trip-snow.jpg";
import tripSafari from "@/assets/trip-safari.jpg";
import tripGreece from "@/assets/trip-greece.jpg";
import tripJapan from "@/assets/trip-japan.jpg";
import tripMorocco from "@/assets/trip-morocco.jpg";
import type { Trip, User, Booking, Comment } from "@/types";

export const mockTrips: Trip[] = [
  {
    id: "1",
    name: "مغامرة جبال الألب",
    description: "استمتع برحلة تسلق مذهلة...",
    location: "سويسرا",
    start_date: "2026-04-15",
    end_date: "2026-04-22",
    price: 2500,
    max_capacity: 12,
    images: [tripAdventure],
    type: "مغامرات",
    createdAt: "2026-01-10",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "عطلة عائلية في المالديف",
    description:
      "رحلة عائلية مميزة في جزر المالديف الساحرة. استرخِ على الشواطئ الرملية البيضاء واستمتع بالأنشطة المائية المتنوعة مع العائلة.",
    location: "المالديف",
    start_date: "2026-05-01",
    end_date: "2026-05-08",
    price: 4200,
    max_capacity: 8,
    images: [tripFamily],
    type: "عائلية",
    createdAt: "2026-01-12",
    createdBy: "admin",
  },
  {
    id: "3",
    name: "إقامة فاخرة في بورا بورا",
    description:
      "تجربة فاخرة لا مثيل لها في أكواخ فوق الماء في بورا بورا. استمتع بالمياه الفيروزية والخدمة الراقية والمأكولات العالمية.",
    location: "بورا بورا",
    start_date: "2026-06-10",
    end_date: "2026-06-17",
    price: 7500,
    max_capacity: 4,
    images: [tripLuxury],
    type: "فاخرة",
    createdAt: "2026-01-15",
    createdBy: "admin",
  },
  {
    id: "4",
    name: "استكشاف معابد أنغكور",
    description:
      "رحلة ثقافية فريدة لاستكشاف معابد أنغكور القديمة في كمبوديا. تعرّف على تاريخ الخمير العريق واستمتع بالعمارة المذهلة.",
    location: "كمبوديا",
    start_date: "2026-03-20",
    end_date: "2026-03-27",
    price: 1800,
    max_capacity: 15,
    images: [tripCultural],
    type: "ثقافية",
    createdAt: "2026-01-18",
    createdBy: "admin",
  },
  {
    id: "5",
    name: "سفاري صحراء دبي",
    description:
      "مغامرة صحراوية مثيرة في صحراء دبي. تتضمن ركوب الجمال والتزلج على الرمال وعشاء تحت النجوم في مخيم فاخر.",
    location: "دبي",
    start_date: "2026-04-01",
    end_date: "2026-04-05",
    price: 1200,
    max_capacity: 20,
    images: [tripDesert],
    type: "صحراوية",
    createdAt: "2026-01-20",
    createdBy: "admin",
  },
  {
    id: "6",
    name: "شواطئ زنجبار الساحرة",
    description:
      "استمتع بأجمل شواطئ زنجبار ذات الرمال البيضاء والمياه الفيروزية. تتضمن الرحلة غوص مع الدلافين وزيارة مزارع التوابل وجولة في المدينة القديمة.",
    location: "زنجبار",
    start_date: "2026-05-15",
    end_date: "2026-05-22",
    price: 3200,
    max_capacity: 10,
    images: [tripBeach],
    type: "عائلية",
    createdAt: "2026-01-22",
    createdBy: "admin",
  },
  {
    id: "7",
    name: "اكتشف إسطنبول التاريخية",
    description:
      "جولة ثقافية في قلب إسطنبول. زيارة آيا صوفيا والمسجد الأزرق والبازار الكبير مع تذوق أشهى المأكولات التركية وجولة على مضيق البوسفور.",
    location: "إسطنبول",
    start_date: "2026-03-10",
    end_date: "2026-03-16",
    price: 1500,
    max_capacity: 25,
    images: [tripCity],
    type: "ثقافية",
    createdAt: "2026-01-25",
    createdBy: "admin",
  },
  {
    id: "8",
    name: "تزلج في جبال النمسا",
    description:
      "رحلة تزلج مثيرة في منتجعات النمسا الثلجية. إقامة فاخرة في شاليهات جبلية مع دروس تزلج للمبتدئين وسبا استرخائي.",
    location: "النمسا",
    start_date: "2026-12-20",
    end_date: "2026-12-28",
    price: 3800,
    max_capacity: 14,
    images: [tripSnow],
    type: "مغامرات",
    createdAt: "2026-02-01",
    createdBy: "admin",
  },
  {
    id: "9",
    name: "سفاري كينيا البرية",
    description:
      "مغامرة سفاري لا تُنسى في محمية ماساي مارا. شاهد الحيوانات البرية في بيئتها الطبيعية مع إقامة في مخيمات فاخرة وسط الطبيعة.",
    location: "كينيا",
    start_date: "2026-07-05",
    end_date: "2026-07-12",
    price: 4500,
    max_capacity: 6,
    images: [tripSafari],
    type: "مغامرات",
    createdAt: "2026-02-03",
    createdBy: "admin",
  },
  {
    id: "10",
    name: "جزيرة سانتوريني اليونانية",
    description:
      "إقامة فاخرة في سانتوريني مع إطلالات خلابة على البحر الأبيض المتوسط. غروب الشمس الأسطوري وجولات في القرى البيضاء الساحرة.",
    location: "اليونان",
    start_date: "2026-06-01",
    end_date: "2026-06-08",
    price: 5200,
    max_capacity: 8,
    images: [tripGreece],
    type: "فاخرة",
    createdAt: "2026-02-05",
    createdBy: "admin",
  },
  {
    id: "11",
    name: "ربيع اليابان وأزهار الساكورا",
    description:
      "رحلة ثقافية فريدة في موسم أزهار الكرز. زيارة المعابد القديمة في كيوتو وطوكيو مع تجربة حفلات الشاي التقليدية والمأكولات اليابانية الأصيلة.",
    location: "اليابان",
    start_date: "2026-04-01",
    end_date: "2026-04-10",
    price: 5800,
    max_capacity: 10,
    images: [tripJapan],
    type: "ثقافية",
    createdAt: "2026-02-07",
    createdBy: "admin",
  },
  {
    id: "12",
    name: "ليالي الصحراء المغربية",
    description:
      "مغامرة صحراوية في قلب الصحراء الكبرى المغربية. ركوب الجمال عبر الكثبان الذهبية والمبيت في مخيمات بربرية تحت السماء المرصعة بالنجوم.",
    location: "المغرب",
    start_date: "2026-10-05",
    end_date: "2026-10-11",
    price: 1600,
    max_capacity: 18,
    images: [tripMorocco],
    type: "صحراوية",
    createdAt: "2026-02-09",
    createdBy: "admin",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "أحمد المدير",
    email: "admin@rihlat.com",
    role: "admin",
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    name: "سارة محمد",
    email: "sara@example.com",
    role: "user",
    createdAt: "2026-01-05",
  },
  {
    id: "3",
    name: "خالد العلي",
    email: "khaled@example.com",
    role: "user",
    createdAt: "2026-01-08",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "2",
    tripId: "1",
    createdAt: "2026-02-01",
    status: "confirmed",
  },
  {
    id: "2",
    userId: "2",
    tripId: "3",
    createdAt: "2026-02-03",
    status: "confirmed",
  },
  {
    id: "3",
    userId: "3",
    tripId: "2",
    createdAt: "2026-02-05",
    status: "cancelled",
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    userId: "2",
    userName: "سارة محمد",
    tripId: "1",
    text: "رحلة رائعة! أنصح بها بشدة 🌟",
    rating: 5, // لازم يكون موجود
    createdAt: "2026-02-02",
  },
  {
    id: "2",
    userId: "3",
    userName: "خالد العلي",
    tripId: "1",
    text: "تجربة لا تُنسى، المناظر كانت خيالية",
    rating: 4,
    createdAt: "2026-02-03",
  },
  {
    id: "3",
    userId: "2",
    userName: "سارة محمد",
    tripId: "3",
    text: "أجمل رحلة في حياتي! الخدمة ممتازة",
    rating: 5,
    createdAt: "2026-02-04",
  },
];
