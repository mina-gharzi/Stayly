// src/pages/Contact/index.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Headphones,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/schemas/contact";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/common/FadeIn";
import { PageContainer } from "@/components/common/PageContainer";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/utils/cn";

import contactHeroImg from "@/assets/contact-us.jpg";

const contactMethods = [
  {
    icon: Mail,
    label: "ایمیل",
    value: "support@stayly.com",
    ltr: true,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    label: "تلفن",
    value: "+98 21 1234 5678",
    ltr: true,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MapPin,
    label: "آدرس",
    value: "تهران، ایران",
    ltr: false,
    color: "bg-amber-50 text-amber-600",
  },
];

const faq = [
  {
    q: "چگونه رزرو کنم؟",
    a: "کافیست هتل مورد نظر را انتخاب کرده و مراحل رزرو را طی کنید.",
  },
  {
    q: "آیا امکان لغو رزرو وجود دارد؟",
    a: "بله، تا ۴۸ ساعت قبل از ورود امکان لغو رایگان دارید.",
  },
  {
    q: "روش پرداخت چیست؟",
    a: "با کارت بانکی آنلاین پرداخت کنید.",
  },
];

export function Contact() {
  const showToast = useToastStore((s) => s.show);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    showToast("پیام شما با موفقیت ارسال شد", "success");
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen">
      {/* ── هیرو ── */}
      <div className="relative overflow-hidden px-4 py-12 sm:py-28">
        <div className="absolute inset-0">
          <img
            src={contactHeroImg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>

        <FadeIn>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:mb-6 sm:h-16 sm:w-16">
              <Headphones className="h-5 w-5 text-white sm:h-7 sm:w-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              ما اینجا هستیم که به شما کمک کنیم
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base">
              سوالی دارید؟ پیشنهادی دارید؟ یا مشکلی پیش آمده است؟ تیم پشتیبانی ما
              آماده شنیدن پیام شماست.
            </p>
          </div>
        </FadeIn>
      </div>

      {/*
        ── کارت‌های اطلاعات تماس ──
        نکته: قبلاً این بخش خودش px-4 و max-w-3xl را جدا تعریف می‌کرد و
        بخش پایین‌تر هم max-w-5xl px-4 sm:px-6 را جدا. چون این دو مقدار
        در برک‌پوینت‌های مختلف با هم فرق می‌کردند (px-4 در موبایل یکی بود
        ولی منبعشان جدا بود)، هر گونه تغییر بعدی در یکی از این دو، بدون
        تغییر در دیگری، باعث می‌شد لبه‌ها از هم جدا شوند. حالا هر دو از
        PageContainer مشترک پدینگ می‌گیرند، پس تراز بودن تضمین‌شده است.
      */}
      <div className="relative z-10 -mt-6 sm:-mt-8">
        <PageContainer maxWidth="max-w-3xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {contactMethods.map((item, index) => (
              <FadeIn key={item.label} delay={index * 100} direction="up">
                <div className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-card transition-all duration-300 hover:border-primary-100 hover:shadow-elevated">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      item.color,
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400">{item.label}</p>
                    <p
                      className={cn(
                        "mt-0.5 wrap-break-word text-sm font-semibold text-neutral-800",
                        item.ltr && "ltr-content",
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* ── محتوا ── */}
      <div className="py-10 sm:py-16">
        <PageContainer maxWidth="max-w-5xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            {/* فرم */}
            <FadeIn direction="up" className="lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
                {/* هدر فرم */}
                <div className="border-b border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-8 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 sm:h-10 sm:w-10">
                      <MessageSquare className="h-icon-sm w-icon-sm text-primary-600 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
                        پیام بفرستید
                      </h2>
                      <p className="text-xs text-neutral-500 sm:text-sm">
                        فرم زیر را پر کنید تا در اسرع وقت پاسخ شما را بدهیم
                      </p>
                    </div>
                  </div>
                </div>

                {/* فرم */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-8"
                >
                  {/* نام */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-medium text-neutral-800"
                    >
                      نام
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                        <Mail className="h-icon-sm w-icon-sm text-neutral-400" />
                      </div>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="نام کامل"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={cn(
                          "h-11 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400 sm:h-12",
                          "transition-all duration-200",
                          "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                          errors.name
                            ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                            : "border-neutral-200 hover:border-neutral-300",
                        )}
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p id="contact-name-error" className="text-xs text-error-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* ایمیل */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-sm font-medium text-neutral-800"
                    >
                      ایمیل
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                        <Mail className="h-icon-sm w-icon-sm text-neutral-400" />
                      </div>
                      <input
                        id="contact-email"
                        type="email"
                        dir="ltr"
                        placeholder="email@example.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={cn(
                          "h-11 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400 sm:h-12",
                          "transition-all duration-200",
                          "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                          errors.email
                            ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                            : "border-neutral-200 hover:border-neutral-300",
                        )}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p id="contact-email-error" className="text-xs text-error-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* پیام */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-medium text-neutral-800"
                    >
                      پیام
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="پیام خود را اینجا بنویسید..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={cn(
                        "w-full resize-none rounded-xl border bg-neutral-50/50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400",
                        "transition-all duration-200",
                        "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                        errors.message
                          ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                          : "border-neutral-200 hover:border-neutral-300",
                      )}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className="text-xs text-error-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* دکمه ارسال */}
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      className="rounded-xl px-8"
                    >
                      <Send className="h-4 w-4" />
                      <span>ارسال پیام</span>
                    </Button>
                    {submitted && (
                      <div className="flex items-center gap-2 text-sm text-success-500 animate-[fadeIn_0.3s_ease-out]">
                        <CheckCircle2 className="h-4 w-4" />
                        ارسال شد!
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </FadeIn>

            {/* سایدبار */}
            <FadeIn direction="up" delay={150} className="lg:col-span-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* ساعت کاری */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 sm:h-10 sm:w-10">
                      <Clock className="h-icon-sm w-icon-sm text-primary-600 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        ساعات پشتیبانی
                      </p>
                      <p className="text-xs text-neutral-400">
                        شنبه تا پنج‌شنبه
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">شنبه - چهارشنبه</span>
                      <span className="font-medium text-neutral-800">
                        ۹:۰۰ - ۱۸:۰۰
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">پنج‌شنبه</span>
                      <span className="font-medium text-neutral-800">
                        ۹:۰۰ - ۱۳:۰۰
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-primary-50/50 px-3.5 py-2 text-xs text-primary-700 sm:mt-4 sm:py-2.5">
                    معمولاً در کمتر از ۲ ساعت پاسخ می‌دهیم
                  </div>
                </div>

                {/* پشتیبانی سریع */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 sm:h-10 sm:w-10">
                      <Globe className="h-icon-sm w-icon-sm text-emerald-600 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">
                        پشتیبانی آنلاین
                      </p>
                      <p className="ltr-content truncate text-xs text-neutral-400">
                        support@stayly.com
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 sm:mt-4">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />
                    </span>
                    <span className="text-xs font-medium text-success-600">
                      آنلاین — آماده پاسخگویی
                    </span>
                  </div>
                </div>

                {/* سوالات متداول */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:p-5">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    سوالات متداول
                  </h3>
                  <div className="mt-2.5 space-y-2 sm:mt-3.5 sm:space-y-3">
                    {faq.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100/80 sm:p-3.5"
                      >
                        <p className="text-xs font-semibold text-neutral-800">
                          {item.q}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
