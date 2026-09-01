// src/schemas/guestInfo.ts
import { z } from "zod";

export const guestInfoSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  email: z.string().min(1, "ایمیل الزامی است").email("ایمیل معتبر نیست"),
  phone: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^\+?[0-9\s-]{7,15}$/, "شماره تلفن معتبر نیست"),
  specialRequests: z.string().optional(),
});
export type GuestInfoFormValues = z.infer<typeof guestInfoSchema>;
