// Cấu hình next/font/local (Import từ assets)
import localFont from "next/font/local";

export const Font = localFont({
    src: [
        // Inter Font 
        { path: '../assets/fonts/Inter-Black.otf', weight: '900', style: 'normal' },
        { path: '../assets/fonts/Inter-BlackItalic.otf', weight: '900', style: 'italic' },
        { path: '../assets/fonts/Inter-ExtraBold.otf', weight: '800', style: 'normal' },
        { path: '../assets/fonts/Inter-ExtraBoldItalic.otf', weight: '800', style: 'italic' },
        { path: '../assets/fonts/Inter-Bold.otf', weight: '700', style: 'normal' },
        { path: '../assets/fonts/Inter-BoldItalic.otf', weight: '700', style: 'italic' },
        { path: '../assets/fonts/Inter-SemiBold.otf', weight: '600', style: 'normal' },
        { path: '../assets/fonts/Inter-SemiBoldItalic.otf', weight: '600', style: 'italic' },
        { path: '../assets/fonts/Inter-Medium.otf', weight: '500', style: 'normal' },
        { path: '../assets/fonts/Inter-MediumItalic.otf', weight: '500', style: 'italic' },
        { path: '../assets/fonts/Inter-Regular.otf', weight: '400', style: 'normal' },
        { path: '../assets/fonts/Inter-Italic.otf', weight: '400', style: 'italic' },
        { path: '../assets/fonts/Inter-Light.otf', weight: '300', style: 'normal' },
        { path: '../assets/fonts/Inter-LightItalic.otf', weight: '300', style: 'italic' },
        { path: '../assets/fonts/Inter-ExtraLight.otf', weight: '200', style: 'normal' },
        { path: '../assets/fonts/Inter-ExtraLightItalic.otf', weight: '200', style: 'italic' },
        { path: '../assets/fonts/Inter-Thin.otf', weight: '100', style: 'normal' },
        { path: '../assets/fonts/Inter-ThinItalic.otf', weight: '100', style: 'italic' },
        
        // Lato Font
        { path: '../assets/fonts/Lato-Black.ttf', weight: '900', style: 'normal' },
        { path: '../assets/fonts/Lato-BlackItalic.ttf', weight: '900', style: 'italic' },
        { path: '../assets/fonts/Lato-Heavy.ttf', weight: '800', style: 'normal' },
        { path: '../assets/fonts/Lato-HeavyItalic.ttf', weight: '800', style: 'italic' },
        { path: '../assets/fonts/Lato-Bold.ttf', weight: '700', style: 'normal' },
        { path: '../assets/fonts/Lato-BoldItalic.ttf', weight: '700', style: 'italic' },
        { path: '../assets/fonts/Lato-Semibold.ttf', weight: '600', style: 'normal' },
        { path: '../assets/fonts/Lato-SemiboldItalic.ttf', weight: '600', style: 'italic' },
        { path: '../assets/fonts/Lato-Medium.ttf', weight: '500', style: 'normal' },
        { path: '../assets/fonts/Lato-MediumItalic.ttf', weight: '500', style: 'italic' },
        { path: '../assets/fonts/Lato-Regular.ttf', weight: '400', style: 'normal' },
        { path: '../assets/fonts/Lato-Italic.ttf', weight: '400', style: 'italic' },
        { path: '../assets/fonts/Lato-Light.ttf', weight: '300', style: 'normal' },
        { path: '../assets/fonts/Lato-LightItalic.ttf', weight: '300', style: 'italic' },
        { path: '../assets/fonts/Lato-Hairline.ttf', weight: '100', style: 'normal' },
        { path: '../assets/fonts/Lato-HairlineItalic.ttf', weight: '100', style: 'italic' },
        { path: '../assets/fonts/Lato-Thin.ttf', weight: '100', style: 'normal' },
        { path: '../assets/fonts/Lato-ThinItalic.ttf', weight: '100', style: 'italic' },
        
        // Tahoma Font
        { path: '../assets/fonts/tahoma.ttf', weight: '400', style: 'normal' },
        { path: '../assets/fonts/tahomabd.ttf', weight: '700', style: 'normal' },
        
        // Space Mono Font
        { path: '../assets/fonts/SpaceMono-Regular.ttf', weight: '400', style: 'normal' },
    ],
    variable: "--font-latee",
    display: "swap",
});