// src/utils/propertyTypes.ts
import {
  Building2,
  Palmtree,
  Home as HomeIcon,
  Warehouse,
  BedSingle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { PropertyType } from "@/types";

export interface PropertyTypeMeta {
  label: string;
  icon: LucideIcon;
  /** پس‌زمینه حباب آیکون */
  iconBg: string;
  /** رنگ آیکون در حالت idle */
  text: string;
  /** تعویض رنگ هنگام hover (برای کارت‌های بزرگ) */
  hoverBg: string;
  /** حلقه شعاع هنگام hover */
  ring: string;
  /** کلاس‌های چیپ انتخاب‌شده */
  chipActive: string;
  /** کلاس‌های چیپ وقتی idle */
  chipIdle: string;
}

export const propertyTypeMeta: Record<PropertyType, PropertyTypeMeta> = {
  hotel: {
    label: "هتل",
    icon: Building2,
    iconBg: "bg-primary-50",
    text: "text-primary-600",
    hoverBg: "group-hover:bg-primary-600 group-hover:text-white",
    ring: "group-hover:ring-primary-300/40",
    chipActive: "border-primary-600 bg-primary-600 text-white",
    chipIdle: "hover:border-primary-300 hover:text-primary-700",
  },
  resort: {
    label: "استراحتگاه",
    icon: Palmtree,
    iconBg: "bg-emerald-50",
    text: "text-emerald-600",
    hoverBg: "group-hover:bg-emerald-600 group-hover:text-white",
    ring: "group-hover:ring-emerald-300/40",
    chipActive: "border-emerald-600 bg-emerald-600 text-white",
    chipIdle: "hover:border-emerald-300 hover:text-emerald-700",
  },
  apartment: {
    label: "آپارتمان",
    icon: HomeIcon,
    iconBg: "bg-amber-50",
    text: "text-amber-600",
    hoverBg: "group-hover:bg-amber-600 group-hover:text-white",
    ring: "group-hover:ring-amber-300/40",
    chipActive: "border-amber-600 bg-amber-600 text-white",
    chipIdle: "hover:border-amber-300 hover:text-amber-700",
  },
  villa: {
    label: "ویلا",
    icon: Warehouse,
    iconBg: "bg-sky-50",
    text: "text-sky-600",
    hoverBg: "group-hover:bg-sky-600 group-hover:text-white",
    ring: "group-hover:ring-sky-300/40",
    chipActive: "border-sky-600 bg-sky-600 text-white",
    chipIdle: "hover:border-sky-300 hover:text-sky-700",
  },
  hostel: {
    label: "هاستل",
    icon: BedSingle,
    iconBg: "bg-violet-50",
    text: "text-violet-600",
    hoverBg: "group-hover:bg-violet-600 group-hover:text-white",
    ring: "group-hover:ring-violet-300/40",
    chipActive: "border-violet-600 bg-violet-600 text-white",
    chipIdle: "hover:border-violet-300 hover:text-violet-700",
  },
  boutique: {
    label: "بوتیک",
    icon: Sparkles,
    iconBg: "bg-rose-50",
    text: "text-rose-600",
    hoverBg: "group-hover:bg-rose-600 group-hover:text-white",
    ring: "group-hover:ring-rose-300/40",
    chipActive: "border-rose-600 bg-rose-600 text-white",
    chipIdle: "hover:border-rose-300 hover:text-rose-700",
  },
};