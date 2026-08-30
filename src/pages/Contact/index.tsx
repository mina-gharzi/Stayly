// src/pages/Contact/index.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/schemas/contact";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";
import contactHeroImg from "@/assets/contact-us.jpg";

const contactInfo = [
  { icon: Mail, label: "ایمیل", value: "support@stayly.com", ltr: true },
  { icon: Phone, label: "تلفن", value: "+98 21 1234 5678", ltr: true },
  { icon: MapPin, label: "آدرس", value: "تهران، ایران", ltr: false },
];

export function Contact() {
  const showToast = useToastStore((s) => s.show);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(_values: ContactFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    showToast("پیام شما با موفقیت ارسال شد", "success");
    reset();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ═══ هیرو با عکس ═══ */}
      <div className="overflow-hidden">
        <section className="relative px-4 pt-24 pb-28 sm:pt-32 sm:pb-36">
          <div className="absolute inset-0">
            <img
              src={contactHeroImg}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/60" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              سوالی دارید؟ خوشحال می‌شویم کمکتان کنیم.
            </p>
          </div>
        </section>

        {/* کارت‌های اطلاعات شناور */}
        <div className="relative z-10 mx-auto -mt-12 max-w-3xl px-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-elevated sm:flex-col sm:items-center sm:p-6 sm:text-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
                  <item.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="sm:mt-2">
                  <p className="text-sm font-medium text-neutral-900">
                    {item.label}
                  </p>
                  <p
                    className={`mt-0.5 text-sm text-neutral-600 ${item.ltr ? "ltr-content" : ""}`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ محتوا ═══ */}
      <div className="mx-auto max-w-5xl px-4 pb-24">
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* فرم */}
          <div className="lg:col-span-8">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-neutral-900">
                پیام بفرستید
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                فرم زیر رو پر کنید تا در اسرع وقت با شما تماس بگیریم.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col gap-4"
              >
                <Input
                  label="نام"
                  placeholder="نام کامل خود را وارد کنید"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <Input
                  label="ایمیل"
                  type="email"
                  placeholder="email@example.com"
                  className="ltr-content"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-800">
                    پیام
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="پیام خود را اینجا بنویسید..."
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  {errors.message && (
                    <p className="text-xs text-error-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="mt-1 w-full sm:w-fit"
                >
                  <Send className="h-4 w-4" />
                  <span>ارسال پیام</span>
                </Button>
              </form>
            </div>
          </div>

          {/* اطلاعات تکمیلی */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-4">
              {/* ساعت پشتیبانی */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      ساعات پشتیبانی
                    </p>
                    <p className="text-sm text-neutral-600">شنبه تا پنج‌شنبه</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-neutral-600">
                  معمولاً در کمتر از ۲ ساعت به پیام‌های شما پاسخ می‌دهیم.
                </p>
              </div>

              {/* پشتیبانی سریع */}
              <div className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      پشتیبانی سریع
                    </p>
                    <p className="ltr-content text-sm text-neutral-600">
                      support@stayly.com
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success-500" />
                  <span className="text-xs font-medium text-success-500">
                    آنلاین
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
