import { inter, lato, spaceMono } from "@/src/config/fonts";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lato.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  );
}