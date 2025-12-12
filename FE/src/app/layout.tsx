import type { Metadata } from "next";
import { 
  // Inter
  interThin, interThinItalic, interExtraLight, interExtraLightItalic,
  interLight, interLightItalic, interRegular, interItalic,
  interMedium, interMediumItalic, interSemiBold, interSemiBoldItalic,
  interBold, interBoldItalic, interExtraBold, interExtraBoldItalic,
  interBlack, interBlackItalic,
  
  // Lato
  latoThin, latoThinItalic, latoLight, latoLightItalic,
  latoRegular, latoItalic, latoMedium, latoMediumItalic,
  latoSemibold, latoSemiboldItalic, latoBold, latoBoldItalic,
  latoHeavy, latoHeavyItalic, latoBlack, latoBlackItalic,
  
  // Tahoma
  tahomaRegular, tahomaBold,
  
  // Space Mono
  spaceMono
} from "../config/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lavender Teeducation",
  description: "A website to enhance critical thinking and diagnostic skills through realistic simulated scenarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${interThin.variable} ${interThinItalic.variable} ${interExtraLight.variable} ${interExtraLightItalic.variable}
          ${interLight.variable} ${interLightItalic.variable} ${interRegular.variable} ${interItalic.variable}
          ${interMedium.variable} ${interMediumItalic.variable} ${interSemiBold.variable} ${interSemiBoldItalic.variable}
          ${interBold.variable} ${interBoldItalic.variable} ${interExtraBold.variable} ${interExtraBoldItalic.variable}
          ${interBlack.variable} ${interBlackItalic.variable}
          ${latoThin.variable} ${latoThinItalic.variable} ${latoLight.variable} ${latoLightItalic.variable}
          ${latoRegular.variable} ${latoItalic.variable} ${latoMedium.variable} ${latoMediumItalic.variable}
          ${latoSemibold.variable} ${latoSemiboldItalic.variable} ${latoBold.variable} ${latoBoldItalic.variable}
          ${latoHeavy.variable} ${latoHeavyItalic.variable} ${latoBlack.variable} ${latoBlackItalic.variable}
          ${tahomaRegular.variable} ${tahomaBold.variable}
          ${spaceMono.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}