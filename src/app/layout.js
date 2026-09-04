import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Slotly",
  description: "Book appointments with your favorite providers online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFAF8] dark:bg-[#14161B] text-[#1C1F26] dark:text-[#FAFAF8] transition-colors font-['Inter',sans-serif]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}