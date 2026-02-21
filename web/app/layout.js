import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Mission Accomplished | Coolify Deploy',
  description: 'Celebrating successful CI/CD deployment on Coolify VPS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
