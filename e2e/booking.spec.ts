// e2e/booking.spec.ts
// جریان کامل رزرو: هتل → اتاق → اطلاعات مسافر → پرداخت → تأییدیه
import { test, expect } from '@playwright/test'
import { loginAs, clickFirstEnabledRoom } from './helpers'

test.describe('Booking flow', () => {
  test('رزرو موفق با کارت 4242 به صفحه تأییدیه می‌رسد', async ({ page }) => {
    await loginAs(page)

    // رفتن به نتایج جستجو و انتخاب اولین هتل
    await page.goto('/hotels')
    const firstHotel = page.locator('a[href^="/hotels/"]').first()
    await expect(firstHotel).toBeVisible()
    await firstHotel.click()
    await page.waitForURL(/\/hotels\/[\w-]+$/)

    // انتخاب یک اتاق موجود
    await expect(page.locator('#rooms-anchor')).toBeVisible()
    await clickFirstEnabledRoom(page)
    await page.waitForURL(/\/booking\//)

    // تکمیل اطلاعات مسافر در صفحه رزرو
    await expect(page.getByRole('heading', { name: 'تکمیل اطلاعات رزرو' })).toBeVisible()
    await page.locator('#firstName').fill('Elena')
    await page.locator('#lastName').fill('Rossi')
    await page.locator('#email').fill('elena.rossi@example.com')
    await page.locator('#phone').fill('+393201112233')
    await page.getByRole('button', { name: 'ادامه به پرداخت', exact: true }).click()

    // صفحه پرداخت
    await page.waitForURL(/\/checkout/)
    await expect(page.getByRole('heading', { name: 'پرداخت' })).toBeVisible()
    await page.locator('#cardNumber').fill('4242 4242 4242 4242')
    await page.locator('#cardHolder').fill('Elena Rossi')
    await page.locator('#expiry').fill('12/28')
    await page.locator('#cvv').fill('123')
    await page.getByRole('button', { name: /^پرداخت/ }).click()

    // رسیدن به صفحه تأییدیه
    await page.waitForURL(/\/confirmation\//)
    await expect(page.getByRole('heading', { name: 'رزرو با موفقیت انجام شد' })).toBeVisible()
  })

  test('کارت 0000 باعث نمایش خطای پرداخت می‌شود و به تأییدیه نمی‌رسد', async ({ page }) => {
    await loginAs(page)

    await page.goto('/hotels')
    await page.locator('a[href^="/hotels/"]').first().click()
    await page.waitForURL(/\/hotels\/[\w-]+$/)
    await expect(page.locator('#rooms-anchor')).toBeVisible()
    await clickFirstEnabledRoom(page)
    await page.waitForURL(/\/booking\//)

    await page.locator('#firstName').fill('Elena')
    await page.locator('#lastName').fill('Rossi')
    await page.locator('#email').fill('elena.rossi@example.com')
    await page.locator('#phone').fill('+393201112233')
    await page.getByRole('button', { name: 'ادامه به پرداخت', exact: true }).click()
    await page.waitForURL(/\/checkout/)

    await page.locator('#cardNumber').fill('0000 0000 0000 0000')
    await page.locator('#cardHolder').fill('Elena Rossi')
    await page.locator('#expiry').fill('12/28')
    await page.locator('#cvv').fill('123')
    await page.getByRole('button', { name: /^پرداخت/ }).click()

    // خطای پرداخت نمایش داده می‌شود (هم در فرم و هم در توست) و هنوز در صفحه پرداخت هستیم
    await expect(page.getByText(/پرداخت ناموفق بود/).first()).toBeVisible({ timeout: 15_000 })
    await expect(page).toHaveURL(/\/checkout/)
  })
})
