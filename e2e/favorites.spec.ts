// e2e/favorites.spec.ts
// افزودن اقامتگاه به علاقه‌مندی‌ها و مشاهده آن در صفحه علاقه‌مندی‌ها
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Favorites', () => {
  test('افزودن به علاقه‌مندی‌ها روی صفحه نتایج، در صفحه علاقه‌مندی‌ها نمایش داده می‌شود', async ({ page }) => {
    await loginAs(page)

    await page.goto('/hotels')
    await expect(page.locator('a[href^="/hotels/"]').first()).toBeVisible()

    // قلب را به اولین کارت (نه اولین دکمه در کل صفحه) می‌چسبانیم تا بعد از تغییر وضعیت،
    // locator دوباره به کارت دیگری رزولور نشود.
    const firstCard = page.locator('a[href^="/hotels/"]').first()
    const href = await firstCard.getAttribute('href')
    const heart = firstCard.getByRole('button', { name: /علاقه/ })
    const before = (await heart.getAttribute('aria-label')) ?? ''
    const expectedAfter = before.startsWith('افزودن') ? /حذف از علاقه/ : /افزودن به علاقه/

    await heart.click()
    await expect(heart).toHaveAttribute('aria-label', expectedAfter)

    if (href) {
      await page.goto('/favorites')
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
    } else {
      await page.goto('/favorites')
      await expect(page.locator('a[href^="/hotels/"]').first()).toBeVisible()
    }
  })

  test('کاربر مهمان با کلیک قلب به صفحه ورود هدایت می‌شود', async ({ page }) => {
    await page.goto('/hotels')
    await expect(page.locator('a[href^="/hotels/"]').first()).toBeVisible()
    await page.getByRole('button', { name: /افزودن به علاقه/ }).first().click()
    await expect(page).toHaveURL(/\/login/)
  })
})
