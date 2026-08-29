// src/data/images.ts
// هر شهر یک Pool تصویر دارد؛ هتل‌های هم‌شهر از تصاویر متفاوت آن Pool استفاده می‌کنند.

export const cityImagePools: Record<string, string[]> = {
  baku: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
    'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=1200',
  ],
  istanbul: [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200',
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200',
    'https://images.unsplash.com/photo-1622396636133-ee5738168c4e?w=1200',
    'https://images.unsplash.com/photo-1567606940406-a68b3a0e13f9?w=1200',
  ],
  dubai: [
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200',
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1200',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200',
    'https://images.unsplash.com/photo-1559599076-9c61d8e4b384?w=1200',
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1200',
  ],
  paris: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=1200',
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200',
    'https://images.unsplash.com/photo-1541343672885-9be56236302a?w=1200',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200',
    'https://images.unsplash.com/photo-1584266337361-679a53c9adc0?w=1200',
  ],
  rome: [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200',
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200',
    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200',
    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200',
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=1200',
  ],
}

export const roomImagePool: string[] = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
  'https://images.unsplash.com/photo-1611048268330-53de574cae3b?w=1200',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
]

export function pickImages(pool: string[], offset: number, count: number): string[] {
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(pool[(offset + i) % pool.length])
  }
  return result
}