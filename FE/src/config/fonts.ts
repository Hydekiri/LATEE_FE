import { Inter, Lato, Space_Mono } from "next/font/google";

// Inter hỗ trợ Variable Font (tự động có đủ mọi độ dày)
export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

// Lato không phải Variable Font, ta sẽ chỉ định các độ dày cần thiết
export const lato = Lato({
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
    style: ["normal", "italic"],
    variable: "--font-lato",
    display: "swap",
});

export const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-mono",
    display: "swap",
});

// KHÔNG CẦN export Tahoma ở đây, chúng ta sẽ dùng font có sẵn của hệ điều hành.