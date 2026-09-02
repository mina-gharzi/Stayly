// e2e/responsive.spec.ts
// اسموک تست ریسپانسیو: دسکتاپ و موبایل
import { test, expect, type Page } from '@playwright/test'

test.describe('Responsive layout', () => {
  test('در دسکتاپ، ناوبری اصلی و منوی موبایل پنهان است', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    // دکمه منوی موبایل در دسکتاپ پنهان است
    await expect(page.getByLabel('باز کردن منو')).toBeHidden()
    // لینک ناوبری اصلی (هتل‌ها) قابل مشاهده است
    await expect(page.getByRole('link', { name: 'هتلها' })).toBeVisible()
  })

  test('در موبایل، منوی کشویی باز و بسته می‌شود', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const toggle = page.getByLabel('باز کردن منو')
    await expect(toggle).toBeVisible()
    await toggle.click()

    const drawer = page.getByRole('dialog', { name: 'منوی موبایل' })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('link', { name: 'هتلها' })).toBeVisible()

    // بستن منو — دراور در DOM می‌ماند ولی inert (غیرفعال) می‌شود
    await page.getByLabel('بستن منو').click()
    await expect(drawer).toHaveAttribute('inert', '')
  })
})
