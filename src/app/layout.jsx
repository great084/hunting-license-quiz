import '@/app/globals.css'

export const metadata = {
  title: '狩猟鳥獣クイズ - 資料免許試験対策',
  description: '狩猟鳥獣の判定と種別名を学べるクイズアプリ',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
