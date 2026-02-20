export const metadata = {
  title: 'Coolify Next.js Demo',
  description: 'Single-page demo for Coolify'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
