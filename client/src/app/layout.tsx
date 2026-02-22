import { Poppins } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${poppins.variable} font-sans antialiased bg-[#eff6ff]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
