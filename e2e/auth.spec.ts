// e2e/auth.spec.ts
// تست‌های احراز هویت: ورود با کاربر نمونه و ثبت‌نام کاربر جدید
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

async function openUserMenu(page: import('@playwright/test').Page) {
  await page.locator('button[aria-haspopup="true"]').click()
}

test.describe('Authentication', () => {
  test('ورود با کاربر نمونه (دمو) موفق است', async ({ page }) => {
    await loginAs(page)

    // دکمه‌ی ورود دیگر در navbar نیست
    await expect(page.getByRole('link', { name: 'ورود' })).toHaveCount(0)

    // باز کردن منوی کاربر و دیدن گزینه‌های «رزروهای من» و «خروج»
    await openUserMenu(page)
    await expect(page.getByRole('link', { name: 'رزروهای من' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'پروفایل' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'خروج' })).toBeVisible()
  })

  test('رمز عبور اشتباه، خطای ورود نشان می‌دهد', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill('elena.rossi@example.com')
    await page.locator('#password').fill('wrong-password')
    await page.getByRole('button', { name: 'ورود', exact: true }).click()
    await expect(page.getByText('ایمیل یا رمز عبور اشتباه است')).toBeVisible()
  })

  test('ثبت‌نام کاربر جدید موفق است', async ({ page }) => {
    const unique = Date.now()
    await page.goto('/register')
    await page.locator('#firstName').fill('Ali')
    await page.locator('#lastName').fill('Rezaei')
    await page.locator('#reg-email').fill(`ali.rezaei.${unique}@example.com`)
    await page.locator('#phone').fill('09121111111')
    await page.locator('#reg-password').fill('123456')
    await page.locator('#confirmPassword').fill('123456')
    await page.getByRole('button', { name: 'ثبت‌نام', exact: true }).click()

    // پس از ثبت‌نام، به صفحه‌ی اصلی هدایت شده و لاگین است
    await expect(page).toHaveURL(`${'http://localhost:5173'}/`)
    await openUserMenu(page)
    await expect(page.getByRole('button', { name: 'خروج' })).toBeVisible()
  })

  test('بازنشانی تنظیمات: خروج از حساب، کاربر را به صفحه اصلی می‌برد', async ({ page }) => {
    await loginAs(page)
    await openUserMenu(page)
    await page.getByRole('button', { name: 'خروج' }).click()
    await expect(page).toHaveURL(`${'http://localhost:5173'}/`)
    await expect(page.getByRole('banner').getByRole('link', { name: 'ورود' })).toBeVisible()
  })
})
