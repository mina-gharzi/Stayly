// src/pages/Login/index.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { mockLogin } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      const { user, token } = await mockLogin(values.email, values.password);
      setSession(user, token);
      const redirect = searchParams.get("redirect");
      navigate(redirect ? decodeURIComponent(redirect) : "/");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "ورود ناموفق بود");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* هدر */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 font-display text-lg font-bold text-white shadow-card">
              S
            </span>
          </Link>
          <h1 className="mt-5 text-xl font-bold text-neutral-900">
            ورود به حساب کاربری
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            برای تست: هر ایمیلی با رمز{" "}
            <span className="font-mono text-neutral-600">123456</span>
          </p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <p className="rounded-lg bg-error-100 p-3 text-sm text-error-500">
              {formError}
            </p>
          )}

          <Input
            label="ایمیل"
            type="email"
            className="ltr-content"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="رمز عبور"
            type="password"
            className="ltr-content"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-1">
            ورود
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
