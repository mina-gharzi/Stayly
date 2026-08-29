// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-sm text-neutral-600">
        © {new Date().getFullYear()} Stayly — ساخته‌شده به‌عنوان پروژه نمونه‌کار (Portfolio)
      </div>
    </footer>
  )
}