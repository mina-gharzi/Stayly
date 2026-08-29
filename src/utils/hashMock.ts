// src/utils/hashMock.ts
// هش ساده و غیرامن — فقط برای Mock، هرگز در Production استفاده نشود
export function hashMock(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return `mock_${Math.abs(hash)}`
}