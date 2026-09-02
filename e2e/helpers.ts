// e2e/helpers.ts
// توابع کمکی مشترک برای تست‌های End-to-End
import { type Page } from '@playwright/test'

export const BASE_URL = 'http://localhost:5173'

export async function loginAs(page: Page, email = 'elena.rossi@example.com', password = '123456') {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'ورود', exact: true }).click()
  await page.waitForURL(`${BASE_URL}/`)
}

// از میان اتاق‌های یک هتل، اولین دکمه‌ی فعال «انتخاب اتاق» را می‌زند (اتاق‌های تکمیل‌شده disabled هستند).
export async function clickFirstEnabledRoom(page: Page) {
  const buttons = page.locator('#rooms-anchor').getByRole('button', { name: 'انتخاب اتاق', exact: true })
  const count = await buttons.count()
  for (let i = 0; i < count; i++) {
    if (await buttons.nth(i).isEnabled()) {
      await buttons.nth(i).click()
      return
    }
  }
  throw new Error('No enabled room select button found')
}

// بستن معتبر بودن مقدار عددی قیمت (به‌صورت radix-free)
export function numberFromText(text: string): number {
  const digits = text.replace(/[^\d]/g, '')
  return digits ? Number(digits) : NaN
}
