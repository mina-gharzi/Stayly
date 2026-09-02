// src/utils/currency.ts
const TOMAN_MULTIPLIER = 100_000

function toToman(rawAmount: number): number {
  return Math.round(rawAmount * TOMAN_MULTIPLIER)
}

export function formatToman(rawAmount: number): string {
  return `${toToman(rawAmount).toLocaleString('fa-IR')} تومان`
}