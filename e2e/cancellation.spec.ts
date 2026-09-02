// e2e/cancellation.spec.ts
// لغو رزرو از صفحه «رزروهای من»
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Booking cancellation', () => {
  test('لغو یک رزرو تأیید شده موفق است', async ({ page }) => {
    await loginAs(page)

    await page.goto('/my-bookings')
    await expect(page.getByRole('heading', { name: 'رزروهای من' })).toBeVisible()

    // اولین رزرو در تب «در پیش رو» (pending/confirmed) قابل لغو است
    const firstDetail = page.getByRole('link', { name: /مشاهده جزئیات/ }).first()
    await expect(firstDetail).toBeVisible()
    await firstDetail.click()
    await page.waitForURL(/\/my-bookings\//)

    // کلیک روی دکمه لغو رزرو و تأیید در مودال
    await page.getByRole('button', { name: 'لغو رزرو', exact: true }).click()
    const modal = page.getByRole('dialog', { name: 'لغو رزرو' })
    await expect(modal).toBeVisible()
    await modal.getByRole('button', { name: 'بله، لغو کنید', exact: true }).click()

    // پیام موفقیت و تغییر وضعیت به «لغو شده»
    await expect(page.getByText('رزرو لغو شد و فرآیند استرداد وجه آغاز شد')).toBeVisible()
    await expect(page.getByText('لغو شده').first()).toBeVisible()

    // دکمه لغو بعد از لغو دیگر نمایش داده نمی‌شود
    await expect(page.getByRole('button', { name: 'لغو رزرو', exact: true })).toHaveCount(0)
  })
})
