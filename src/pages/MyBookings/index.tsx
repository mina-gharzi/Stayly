// src/pages/MyBookings/index.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarX,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getBookingsByUser } from "@/services/bookings";
import { BookingCard } from "@/components/booking/BookingCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/common/FadeIn";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/utils/cn";
import type { Booking } from "@/types";

const tabs: {
  key: string;
  label: string;
  statuses: Booking["status"][];
  icon: typeof CalendarCheck;
}[] = [
  {
    key: "upcoming",
    label: "در پیش رو",
    statuses: ["pending", "confirmed"],
    icon: Clock,
  },
  {
    key: "completed",
    label: "انجام‌شده",
    statuses: ["completed"],
    icon: CheckCircle2,
  },
  {
    key: "cancelled",
    label: "لغو شده",
    statuses: ["cancelled"],
    icon: XCircle,
  },
];

export function MyBookings() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: bookings, isLoading, isError, refetch } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => getBookingsByUser(user!.id),
    enabled: !!user,
  });

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  const filtered = (bookings ?? []).filter((b) =>
    currentTab.statuses.includes(b.status)
  );

  const upcomingCount = (bookings ?? []).filter((b) =>
    ["pending", "confirmed"].includes(b.status)
  ).length;
  const completedCount = (bookings ?? []).filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledCount = (bookings ?? []).filter(
    (b) => b.status === "cancelled"
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-700 via-primary-600 to-primary-900 p-6 sm:p-8">
          <div className="absolute inset-0 opacity-deco-light">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="absolute inset-0 pattern-dots opacity-dot" />

          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white">رزروهای من</h1>
            <p className="mt-1 text-sm text-primary-100/70">
              مدیریت و پیگیری رزروهای اقامتگاه
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:max-w-md">
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="text-xl font-bold text-white">{upcomingCount}</div>
                <div className="mt-0.5 text-[11px] text-primary-100/60">
                  در پیش رو
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {completedCount}
                </div>
                <div className="mt-0.5 text-[11px] text-primary-100/60">
                  انجام شده
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {cancelledCount}
                </div>
                <div className="mt-0.5 text-[11px] text-primary-100/60">
                  لغو شده
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mt-6 flex gap-1 rounded-xl border border-neutral-200 bg-white p-1 shadow-card">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-primary-700 text-white shadow-soft"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card"
            >
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="h-40 w-full sm:h-auto sm:w-48" />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {isError && !isLoading && (
          <ErrorState
            description="در دریافت رزروهای شما خطایی رخ داد."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon={CalendarX}
            title="رزروی یافت نشد"
            description={
              activeTab === "upcoming"
                ? "هنوز رزروی انجام نداده‌اید"
                : activeTab === "completed"
                  ? "رزرو انجام شده‌ای ندارید"
                  : "رزرو لغو شده‌ای ندارید"
            }
            action={
              activeTab === "upcoming" ? (
                <Link
                  to="/hotels"
                  className="flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-900 active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  جستجوی اقامتگاه
                </Link>
              ) : undefined
            }
          />
        )}

        {!isLoading &&
          filtered.map((booking) => (
            <FadeIn key={booking.id} direction="up">
              <BookingCard booking={booking} />
            </FadeIn>
          ))}
      </div>
    </div>
  );
}
