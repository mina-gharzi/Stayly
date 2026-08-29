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