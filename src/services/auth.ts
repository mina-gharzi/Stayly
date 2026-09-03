// src/services/auth.ts
import type { User } from '@/types'
import { users as demoUsers } from '../data/users'
import { hashMock } from '@/utils/hashMock'

const REGISTERED_KEY = 'stayly-registered-users'
const DEMO_PASSWORD = '123456' // رمز عبور مشترک همه کاربران نمونه (Mock)

interface RegisteredUser extends User {
  passwordHash: string
}

interface AuthResult {
  user: User
  token: string
}

function getRegisteredUsers(): RegisteredUser[] {
  return JSON.parse(localStorage.getItem(REGISTERED_KEY) ?? '[]')
}

function saveRegisteredUsers(list: RegisteredUser[]) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(list))
}

function toPublicUser(u: RegisteredUser): User {
  return {
    id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email,
    phone: u.phone, avatar: u.avatar, country: u.country,
    preferredCurrency: u.preferredCurrency, preferredLanguage: u.preferredLanguage,
  }
}

function generateToken(): string {
  return `mock_token_${Math.random().toString(36).slice(2)}${Date.now()}`
}

export function mockLogin(email: string, password: string): Promise<AuthResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const registered = getRegisteredUsers().find((u) => u.email === email)
      if (registered) {
        if (registered.passwordHash === hashMock(password)) {
          resolve({ user: toPublicUser(registered), token: generateToken() })
        } else {
          reject(new Error('ایمیل یا رمز عبور اشتباه است'))
        }
        return
      }

      const demo = demoUsers.find((u) => u.email === email)
      if (demo && password === DEMO_PASSWORD) {
        resolve({ user: demo, token: generateToken() })
        return
      }

      reject(new Error('ایمیل یا رمز عبور اشتباه است'))
    }, 500)
  })
}

// خطای ویرایش پروفایل — وقتی ایمیل جدید متعلق به کاربر دیگه‌ای باشه
export class ProfileUpdateError extends Error {
  constructor(message: string = 'این ایمیل قبلاً توسط کاربر دیگری استفاده شده است.') {
    super(message)
    this.name = 'ProfileUpdateError'
  }
}

// آپدیت پروفایل — منبع حقیقتِ نهایی برای لاگین (stayly-registered-users) رو هم به‌روز
// می‌کنه، نه فقط session جاری در authStore. قبلاً Profile فقط authStore.updateUser رو صدا
// می‌زد که صرفاً session رو عوض می‌کرد؛ رکورد registered دست‌نخورده می‌موند و بعد از
// logout/login بعدی، تغییرات (خصوصاً ایمیل) گم می‌شدن.
// کاربرهای دمو (data/users.ts) در registered نیستن — با اولین ویرایش، به یک رکورد واقعی
// در registered تبدیل می‌شن (passwordHash = رمز دمو مشترک) تا تغییراتشون هم بعد از لاگین
// دوباره باقی بمونه.
export function updateProfile(userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const registered = getRegisteredUsers()
      const idx = registered.findIndex((u) => u.id === userId)

      const newEmail = updates.email
      if (newEmail) {
        const emailTakenByOther = registered.some((u) => u.id !== userId && u.email === newEmail)
        const demoOwnsEmail = demoUsers.some((u) => u.id !== userId && u.email === newEmail)
        if (emailTakenByOther || demoOwnsEmail) {
          reject(new ProfileUpdateError())
          return
        }
      }

      if (idx !== -1) {
        registered[idx] = { ...registered[idx], ...updates }
        saveRegisteredUsers(registered)
        resolve(toPublicUser(registered[idx]))
        return
      }

      // کاربر دمو (هنوز در registered نیست) — تبدیل به رکورد واقعی
      const demo = demoUsers.find((u) => u.id === userId)
      if (!demo) {
        reject(new ProfileUpdateError('کاربر یافت نشد.'))
        return
      }

      const promoted: RegisteredUser = {
        ...demo,
        ...updates,
        passwordHash: hashMock(DEMO_PASSWORD),
      }
      saveRegisteredUsers([...registered, promoted])
      resolve(toPublicUser(promoted))
    }, 300)
  })
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export function mockRegister(input: RegisterInput): Promise<AuthResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists =
        getRegisteredUsers().some((u) => u.email === input.email) ||
        demoUsers.some((u) => u.email === input.email)
      if (exists) {
        reject(new Error('این ایمیل قبلاً ثبت‌نام کرده است'))
        return
      }

      const newUser: RegisteredUser = {
        id: `user-${Date.now()}`,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        avatar: `https://i.pravatar.cc/150?u=${input.email}`,
        country: '',
        preferredCurrency: 'IRT',
        preferredLanguage: 'fa',
        passwordHash: hashMock(input.password),
      }

      saveRegisteredUsers([...getRegisteredUsers(), newUser])
      resolve({ user: toPublicUser(newUser), token: generateToken() })
    }, 500)
  })
}