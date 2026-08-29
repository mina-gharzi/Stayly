// src/types/user.ts
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  country: string
  preferredCurrency: string  // 'USD'
  preferredLanguage: string  // 'en'
}